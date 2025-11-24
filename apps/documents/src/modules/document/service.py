from typing import Sequence
from uuid import UUID

from fastapi import UploadFile
from minio import S3Error
from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.core.utils.utils import format_file_size
from src.modules.document.exeptions import DocumentError, DuplicateDocumentError, StorageError
from src.modules.document.model import Document
from src.modules.document.repository import DocumentRepository
from src.modules.document.dtos.request_dtos import DocumentCreate, DocumentUpdate
from src.modules.document.dtos.response_dtos import (
    DocumentResponse,
)
from src.modules.object_storage.service import MinioService
from src.core.config import settings

logger = get_logger(__name__)


class DocumentService(
    BaseService[
        Document, DocumentCreate, DocumentUpdate, DocumentResponse, DocumentRepository
    ]
):
    def __init__(self, repository: DocumentRepository, minio_service: MinioService):
        super().__init__(Document, repository)
        self.minio_service = minio_service

    # async def upload_document(
    #     self, file: UploadFile, user_id: UUID, allow_overwrite: bool = False
    # ) -> Document:

    async def create(
        self,
        file: UploadFile,
        user_id: UUID,
        data: DocumentCreate,
        allow_overwrite: bool = False,
    ) -> DocumentResponse:
        # add user_id from request to entity
        data.user_id = user_id
        # Validate folder exists and belongs to user
        if data.folder_id:
            await self.__validate_folder_ownership(
                folder_id=data.folder_id, user_id=user_id
            )
        # Validate file
        await self._validate_file(
            file=file, user_id=user_id, allow_overwrite=allow_overwrite
        )

        # upload file
        object_name, filename, file_size = await self.upload_to_object_storage(
            file, user_id
        )

        # Create document
        try:
            file_size_str = format_file_size(file_size)
            data.file_url = (
                object_name  # str(user_id) + "/" + filename == path in minio
            )
            data.file_size = file_size_str
            document = await self.repository.create(data)
            return DocumentResponse.model_validate(document)

        except Exception as e:
            # Rollback: delete uploaded file from MinIO
            try:
                await self.minio_service.remove_obj(
                    object_name=filename,
                    user_id=user_id,
                )
            except Exception as cleanup_error:
                logger.error(f"Failed to cleanup file {object_name}: {cleanup_error}")

            raise DocumentError(f"Failed to create document record: {str(e)}") from e

    async def update(
        self, user_id: UUID, id: UUID, obj: DocumentUpdate
    ) -> DocumentResponse:
        entity = await self.__validate_document_ownership(
            document_id=id, user_id=user_id
        )
        result = await self.repository.update(entity, obj)
        return DocumentResponse.model_validate(result)

    async def delete(self, user_id: UUID, id: UUID) -> bool:
        document = await self.__validate_document_ownership(
            document_id=id, user_id=user_id
        )
        result = await self.repository.delete(id)
        try:
            await self.minio_service.remove_obj(
                object_name=document.file_url,
                user_id=user_id,
            )
        except Exception as e:
            raise StorageError(f"Failed to delete file from storage: {str(e)}") from e
        return result

    async def get_by_id(self, user_id: UUID, id: UUID) -> DocumentResponse:
        document = await self.__validate_document_ownership(id, user_id)
        return DocumentResponse.model_validate(document)

    async def get_presigned_url(
        self, user_id: UUID, document_id: UUID
    ) -> str:
        document = await self.__validate_document_ownership(
            document_id=document_id, user_id=user_id
        )
        try:
            url = self.minio_service.generate_presigned_url(file_name=document.file_url)
            if settings.DATA_LAKE_DOMAIN in url:
                return url.replace(settings.DATA_LAKE_DOMAIN, settings.APP_DOMAIN)
            
            return url
        except S3Error as e:
            logger.error(
                f"Failed to generate presigned URL for document {document_id}: {e}"
            )
            raise StorageError(f"Failed to generate download URL: {str(e)}") from e
        except Exception as e:
            logger.error(f"Unexpected error generating presigned URL: {e}")
            raise DocumentError(f"Failed to generate download URL: {str(e)}") from e

    async def get_all(
        self, user_id: UUID, skip: int|None=None, limit: int|None=None
    ) -> Sequence[DocumentResponse]:
        try:
            documents = await self.repository.get_by(field="user_id",value=user_id, skip = skip, limit=limit)
            results = [DocumentResponse.model_validate(doc) for doc in documents]
            logger.info(f"Retrieved {len(results)} documents for user {user_id}")
            return results
        except Exception as e: 
            logger.error(f"Failed to get all documents for: {str(e)}")
            raise DocumentError(f"Failed to get all documents: {str(e)}")

    async def get_by_folder_id(self, user_id: UUID, folder_id: UUID)-> Sequence[DocumentResponse]:
        try: 
            await self.__validate_folder_ownership(folder_id, user_id)
            documents = await self.repository.get_by(field="folder_id",value=folder_id)
            results = [DocumentResponse.model_validate(doc) for doc in documents]
            logger.info(f"Retrieved {len(results)} documents for folder {folder_id}")
            return results
        except Exception as e: 
            logger.error(f"Failed to get documents for: {str(e)}")
            raise DocumentError(f"Failed to get documents: {str(e)}")

    async def get_docs_at_root(self, user_id: UUID)-> Sequence[DocumentResponse]:
        try:
            documents = await self.repository.get_documents_at_root_by_user(user_id)
            results = [DocumentResponse.model_validate(doc) for doc in documents]
            logger.info(f"Retrieved {len(results)} documents at root")
            return results
        except Exception as e:
            logger.error(f"Failed to get documents at root: {str(e)}")
            raise DocumentError(f"Failed to get documents at root: {str(e)}")

    async def upload_to_object_storage(
        self, file: UploadFile, user_id: UUID
    ) -> tuple[str, str, int]:
        # Upload file to MinIO
        try:
            object_name, filename, file_size = await self.minio_service.upload_file(
                file, str(user_id)
            )

        except S3Error as e:
            raise StorageError(f"Failed to upload file: {str(e)}") from e

        return object_name, filename, file_size

    async def __validate_document_ownership(
        self, document_id: UUID, user_id: UUID
    ) -> Document:
        document = await self.repository.get_by_id(document_id)
        if not document:
            raise DocumentError("Document not found")
        if document.user_id != user_id:
            raise DocumentError("You are not the owner of this document")
        return document

    async def __validate_folder_ownership(self, folder_id: UUID, user_id: UUID):
        folder = await self.repository.get_by_id(folder_id)
        if not folder:
            raise DocumentError("Folder not found")
        if folder.user_id != user_id:
            raise DocumentError("You are not the owner of this folder")

    async def _validate_file(
        self, file: UploadFile, user_id: UUID, allow_overwrite: bool
    ) -> None:
        """check if file is valid and upload to minio

        Args:
            file (UploadFile): _description_
            user_id (UUID): _description_
            allow_overwrite (bool): _description_
        """
        MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
        ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"]

        # Check file size
        file.file.seek(0, 2)  # Seek to end
        size = file.file.tell()
        file.file.seek(0)  # Reset

        if size > MAX_FILE_SIZE:
            raise DocumentError(f"File too large. Max size: {MAX_FILE_SIZE} bytes")

        # Check file type
        if file.content_type not in ALLOWED_TYPES:
            raise DocumentError(f"Invalid file type: {file.content_type}")

        # Check if file already exists
        if not file.filename:
            raise DocumentError("No file provided")
        exists_doc = await self.repository.check_exists_on_user(
            user_id=user_id, file_url=str(user_id) + "/" + file.filename
        )

        if exists_doc:
            if not allow_overwrite:
                logger.error(f"File '{file.filename}' already exists. ")
                raise DuplicateDocumentError()

            # TODO : publish event to update document id / remove document id in vector db
            await self.minio_service.remove_obj(
                object_name=file.filename,
                user_id=user_id,
            )
