import subprocess


def main():
    # Apply all migrations
    subprocess.run(["alembic", "upgrade", "head"], check=True)
