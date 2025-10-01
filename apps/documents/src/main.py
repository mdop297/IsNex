from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from minio import Minio
from minio.error import S3Error
import io

app = FastAPI()


# MinIO client
minio_client = Minio(
    "data-lake:9000", access_key="minioadmin", secret_key="minioadmin", secure=False
)

# Tạo bucket nếu chưa có
bucket_name = "my-bucket"
try:
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
except S3Error as e:
    print(f"Error creating bucket: {e}")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Đọc file vào memory buffer
        file_data = await file.read()
        file_stream = io.BytesIO(file_data)

        # Upload lên MinIO
        minio_client.put_object(
            bucket_name,
            file.filename,
            file_stream,
            length=len(file_data),
            content_type=file.content_type or "application/octet-stream",
        )

        return {"message": "File uploaded successfully", "filename": file.filename}

    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e


@app.get("/download/{filename}")
async def download_file(filename: str):
    try:
        try:
            minio_client.stat_object(bucket_name, filename)
        except S3Error:
            raise HTTPException(status_code=404, detail="File not found") from None

        response = minio_client.get_object(bucket_name, filename)

        return StreamingResponse(
            io.BytesIO(response.read()),
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except HTTPException:
        raise
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e
