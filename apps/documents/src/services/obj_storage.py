# obj_storage.py
from functools import lru_cache
from typing import Generator
from dataclasses import dataclass
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
