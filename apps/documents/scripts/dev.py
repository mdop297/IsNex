import subprocess


def main():
    # Run FastAPI dev server
    subprocess.run(["fastapi", "dev", "--host", "0.0.0.0", "src/main.py"], check=True)
