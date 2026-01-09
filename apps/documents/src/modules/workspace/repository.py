from uuid import UUID

from sqlmodel import func, select
from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.modules.workspace.model import DocumentWorkspaceLink, Workspace
from src.modules.workspace.dtos.request_dtos import WorkspaceCreate, WorkspaceUpdate


class WorkspaceRepository(BaseRepository[Workspace, WorkspaceCreate, WorkspaceUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_document_to_workspace(self, workspace_id: UUID, document_id: UUID):
        link = DocumentWorkspaceLink(document_id=document_id, workspace_id=workspace_id)
        self.session.add(link)
        await self.session.commit()
        return True

    async def remove_document_from_workspace(
        self, workspace_id: UUID, document_id: UUID
    ):
        query = select(DocumentWorkspaceLink).where(
            DocumentWorkspaceLink.workspace_id == workspace_id,
            DocumentWorkspaceLink.document_id == document_id,
        )
        result = await self.session.exec(query)
        link = result.one_or_none()
        if link:
            await self.session.delete(link)
            await self.session.commit()
        return True

    async def count_document(self, workspace_id: UUID) -> int:
        """Get number of document of workspace

        Args:
            workspace_id (UUID): _workspace_id

        Returns:
            int: number of documents
        """
        stmt = select(func.count()).where(
            DocumentWorkspaceLink.workspace_id == workspace_id
        )
        result = await self.session.exec(stmt)
        return result.one()
