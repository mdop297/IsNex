class DocumentError(Exception):
    pass


class DocumentNotFoundError(DocumentError):
    pass


class DuplicateDocumentError(DocumentError):
    pass


class StorageError(DocumentError):
    pass
