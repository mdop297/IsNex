import subprocess, sys


def main():
    msg = sys.argv[1] if len(sys.argv) > 1 else "revision"
    subprocess.run(["alembic", "revision", "--autogenerate", "-m", msg], check=True)
