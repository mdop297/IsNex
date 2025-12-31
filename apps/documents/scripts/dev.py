import subprocess


def main():
    subprocess.run(
        [
            "uvicorn",
            "src.main:app",
            "--host",
            "0.0.0.0",
            "--port",
            "8000",
            "--reload",
            "--loop",
            "uvloop",
        ],
        check=True,
    )


if __name__ == "__main__":
    main()
