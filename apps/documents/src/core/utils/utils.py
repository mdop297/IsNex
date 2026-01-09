def format_file_size(size_in_bytes: int) -> str:
    """
    Convert bytes into human-readable string with unit.
    """
    if size_in_bytes < 1024:
        return f"{size_in_bytes} B"
    elif size_in_bytes < 1024**2:
        return f"{round(size_in_bytes / 1024, 2)} kB"
    elif size_in_bytes < 1024**3:
        return f"{round(size_in_bytes / (1024**2), 2)} MiB"
    else:
        return f"{round(size_in_bytes / (1024**3), 2)} GiB"
