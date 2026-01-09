class DocumentError(Exception):
    status_code = 500


class DocumentNotFoundError(DocumentError):
    pass


class DuplicateDocumentError(DocumentError):
    status_code = 409


class StorageError(DocumentError):
    pass
