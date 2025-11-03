# obj_storage.py
from functools import lru_cache
from typing import BinaryIO, Generator
from dataclasses import dataclass
from uuid import UUID
from minio import Minio, S3Error
from fastapi import UploadFile


"""
Singleton Minio client - chỉ tạo 1 lần duy nhất
Thread-safe vì lru_cache có lock
"""


@lru_cache(maxsize=1)
def get_minio_client() -> Minio:
    return Minio(
        "data-lake:9000",
        access_key="minioadmin",
        secret_key="minioadmin",
        secure=False,
    )


@dataclass
class MinioSession:
    client: Minio
    bucket_name: str


def get_minio_session() -> Generator[MinioSession, None, None]:
    bucket_name = "isnex-dev"
    client = get_minio_client()  # Always return same instance

    try:
        if not client.bucket_exists(bucket_name):
            client.make_bucket(bucket_name)
    except S3Error as e:
        print(f"Error creating bucket: {e}")
        raise

    yield MinioSession(client=client, bucket_name=bucket_name)


class MinioService:
    def __init__(self, session: MinioSession) -> None:
        self.client = session.client
        self.bucket_name = session.bucket_name

    async def upload_file(self, file: UploadFile, user_id: str) -> tuple[str, str, int]:
        if not file.filename:
            raise ValueError("No file provided")

        await file.seek(0)
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        result = self.client.put_object(
            self.bucket_name,
            user_id + "/" + file.filename,
            file.file,
            length=file_size,
            content_type=file.content_type or "application/octet-stream",
        )

        return result.object_name, file.filename, file_size

    async def download_file(self, filename: str) -> bytes:
        try:
            response = self.client.get_object(self.bucket_name, filename)
            data = response.read()
            response.close()
            response.release_conn()  # Important: release connection back to pool
            return data
        except S3Error as e:
            raise ValueError(f"File not found: {filename}") from e

    async def create(
        self,
        bucket_name: str,
        user_id: UUID,
        object_name: str,
        data: BinaryIO,
        length: int,
    ):
        result = self.client.put_object(
            bucket_name=bucket_name,
            object_name=str(user_id) + "/" + object_name,
            data=data,
            length=length,
        )
        return result

    async def read(self, bucket_name: str, object_name: str, user_id: UUID):
        try:
            response = self.client.get_object(
                bucket_name, str(user_id) + "/" + object_name
            )
            # Read data from response.
            try:
                for chunk in response.stream():
                    yield chunk

            finally:
                response.close()
                response.release_conn()

        except S3Error as e:
            raise ValueError(f"File not found: {object_name}") from e

    async def update(
        self, bucket_name: str, object_name: str, new_name: str, user_id: UUID
    ):
        try:
            from minio.commonconfig import CopySource

            source = CopySource(bucket_name, str(user_id) + "/" + object_name)

            self.client.copy_object(
                bucket_name=bucket_name,
                object_name=str(user_id) + "/" + new_name,
                source=source,
            )

            self.client.remove_object(
                bucket_name=bucket_name, object_name=str(user_id) + "/" + object_name
            )

            return new_name
        except S3Error as e:
            raise ValueError(
                f"Failed to rename object {object_name} to {new_name}"
            ) from e

    async def remove_obj(self, bucket_name: str, object_name: str, user_id: UUID):
        try:
            self.client.remove_object(
                bucket_name=bucket_name, object_name=str(user_id) + "/" + object_name
            )
        except S3Error as e:
            raise ValueError(f"Failed to delete object {object_name}") from e

    async def remove_objs(self, bucket_name: str, object_names: list, user_id: UUID):
        for object_name in object_names:
            try:
                self.client.remove_object(
                    bucket_name=bucket_name,
                    object_name=str(user_id) + "/" + object_name,
                )
            except S3Error as e:
                raise ValueError(f"Failed to delete object {object_name}") from e
