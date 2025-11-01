from src.core.service.base import BaseService
from src.models.document import Document
from src.repositories.document import DocumentRepository
from src.schemas.requests.document import DocumentCreate, DocumentUpdate


class DocumentService(BaseService[Document, DocumentCreate, DocumentUpdate]):
    def __init__(self, repository: DocumentRepository):
        super().__init__(Document, repository)
