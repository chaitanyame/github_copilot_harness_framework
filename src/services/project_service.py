# src/services/project_service.py
"""Project service for business logic."""

from typing import List, Optional, Tuple
from uuid import UUID

from src.data.store import MockDataStore
from src.models.project import Project, ProjectCreate, ProjectStatus, ProjectUpdate


class ProjectService:
    """Service layer for project operations."""

    def __init__(self) -> None:
        """Initialize with data store instance."""
        self._store = MockDataStore.get_instance()

    def get_all(
        self,
        status: Optional[ProjectStatus] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[List[Project], int]:
        """
        Get all projects with optional filtering and pagination.

        Args:
            status: Filter by project status (optional)
            limit: Maximum number of projects to return
            offset: Number of projects to skip

        Returns:
            Tuple of (list of projects, total count)
        """
        return self._store.get_all(status=status, limit=limit, offset=offset)

    def get_by_id(self, project_id: UUID) -> Optional[Project]:
        """
        Get a project by its ID.

        Args:
            project_id: The UUID of the project

        Returns:
            The project if found, None otherwise
        """
        return self._store.get_by_id(project_id)

    def create(self, project_data: ProjectCreate) -> Project:
        """
        Create a new project.

        Args:
            project_data: The project creation data

        Returns:
            The newly created project
        """
        return self._store.create(project_data)

    def update(
        self, project_id: UUID, update_data: ProjectUpdate
    ) -> Optional[Project]:
        """
        Update an existing project.

        Args:
            project_id: The UUID of the project to update
            update_data: The fields to update

        Returns:
            The updated project if found, None otherwise
        """
        return self._store.update(project_id, update_data)

    def delete(self, project_id: UUID) -> bool:
        """
        Delete a project.

        Args:
            project_id: The UUID of the project to delete

        Returns:
            True if deleted, False if not found
        """
        return self._store.delete(project_id)
