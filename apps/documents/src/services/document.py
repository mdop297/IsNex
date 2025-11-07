from typing import Sequence
from uuid import UUID

from fastapi import UploadFile
from minio import S3Error
from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.core.utils.utils import format_file_size
from src.exceptions.document import DocumentError, StorageError
from src.models.document import Document, FileType
from src.repositories.document import DocumentRepository
from src.schemas.requests.document import DocumentCreate, DocumentUpdate
from src.schemas.responses.document import DocumentResponse
from src.services.obj_storage import MinioService

logger = get_logger(__name__)


class DocumentService(
    BaseService[
        Document, DocumentCreate, DocumentUpdate, DocumentResponse, DocumentRepository
    ]
):
    def __init__(self, repository: DocumentRepository, minio_service: MinioService):
        super().__init__(Document, repository)
        self.minio_service = minio_service

    async def upload_document(
        self, file: UploadFile, user_id: UUID, allow_overwrite: bool = False
    ) -> Document:
        await self._validate_file(file)
        if not file.filename:
            raise DocumentError("No file provided")
        exists_doc = await self.repository.check_exists_on_user(
            user_id=user_id, file_url=str(user_id) + "/" + file.filename
        )

        if exists_doc:
            if not allow_overwrite:
                logger.error(f"File '{file.filename}' already exists. ")
                raise DocumentError(
                    f"File '{file.filename}' already exists. "
                    "Set allow_overwrite=true to replace it."
                )

            # TODO : publish event to update document id / remove document id in vector db
            await self.minio_service.remove_obj(
                self.minio_service.bucket_name,
                object_name=file.filename,
                user_id=user_id,
            )
        try:
            path, filename, file_size = await self.minio_service.upload_file(
                file, str(user_id)
            )

        except S3Error as e:
            raise StorageError(f"Failed to upload file: {str(e)}") from e

        try:
            file_size_str = format_file_size(file_size)
            entity = DocumentCreate(
                user_id=user_id,
                file_url=path,
                name=filename,
                type=FileType.PDF,
                num_pages=0,
                file_size=file_size_str,
            )
            document = await self.repository.create(entity)
            return document
        except Exception as e:
            # Rollback: delete uploaded file from MinIO
            try:
                await self.minio_service.remove_obj(
                    self.minio_service.bucket_name,
                    object_name=file.filename,
                    user_id=user_id,
                )
            except Exception as cleanup_error:
                logger.error(f"Failed to cleanup file {path}: {cleanup_error}")

            raise DocumentError(f"Failed to create document record: {str(e)}") from e

    async def _validate_file(self, file: UploadFile) -> None:
        """Validate file size, type, etc."""
        MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
        ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"]

        # Check file size
        file.file.seek(0, 2)  # Seek to end
        size = file.file.tell()
        file.file.seek(0)  # Reset

        if size > MAX_FILE_SIZE:
            raise DocumentError(f"File too large. Max size: {MAX_FILE_SIZE} bytes")

        if file.content_type not in ALLOWED_TYPES:
            raise DocumentError(f"Invalid file type: {file.content_type}")

    async def create(self, entity: DocumentCreate) -> DocumentResponse:
        result = await self.repository.create(entity)
        return DocumentResponse.model_validate(result)

    async def update(self, entity: Document, obj: DocumentUpdate) -> DocumentResponse:
        result = await self.repository.update(entity, obj)
        return DocumentResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> DocumentResponse:
        document = await self.repository.get_by_id(id)
        if not document:
            raise Exception("Document not found")
        return DocumentResponse.model_validate(document)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[DocumentResponse]:
        documents = await self.repository.get_all(skip, limit)
        results = [DocumentResponse.model_validate(doc) for doc in documents]
        return results
