# src/data/store.py
"""In-memory mock data store with singleton pattern."""

from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple
from uuid import UUID, uuid4

from src.data.seed import generate_seed_data
from src.models.project import Project, ProjectCreate, ProjectStatus, ProjectUpdate


class MockDataStore:
    """
    In-memory data store for Projects.

    Uses singleton pattern - call get_instance() to get the store.
    Data persists only for the lifetime of the application.
    """

    _instance: Optional["MockDataStore"] = None
    _projects: Dict[UUID, Project]

    def __init__(self) -> None:
        """Initialize the store with seed data."""
        self._projects = {}
        self._seed_data()

    @classmethod
    def get_instance(cls) -> "MockDataStore":
        """Get the singleton instance of the data store."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _seed_data(self) -> None:
        """Populate store with initial seed data."""
        seed_projects = generate_seed_data()
        for project in seed_projects:
            self._projects[project.id] = project

    def reset(self) -> None:
        """Clear all data and reseed. Useful for testing."""
        self._projects.clear()
        self._seed_data()

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
            limit: Maximum number of projects to return (default 20)
            offset: Number of projects to skip (default 0)

        Returns:
            Tuple of (list of projects, total count matching filter)
        """
        # Filter by status if provided
        if status is not None:
            filtered = [p for p in self._projects.values() if p.status == status]
        else:
            filtered = list(self._projects.values())

        # Sort by created_at descending (newest first)
        filtered.sort(key=lambda p: p.created_at, reverse=True)

        total = len(filtered)

        # Apply pagination
        paginated = filtered[offset : offset + limit]

        return paginated, total

    def get_by_id(self, project_id: UUID) -> Optional[Project]:
        """
        Get a project by its ID.

        Args:
            project_id: The UUID of the project to find

        Returns:
            The project if found, None otherwise
        """
        return self._projects.get(project_id)

    def create(self, project_data: ProjectCreate) -> Project:
        """
        Create a new project.

        Args:
            project_data: The project creation data

        Returns:
            The newly created project with generated ID and timestamps
        """
        now = datetime.now(timezone.utc)
        project = Project(
            id=uuid4(),
            name=project_data.name,
            description=project_data.description,
            status=project_data.status,
            owner=project_data.owner,
            created_at=now,
            updated_at=now,
        )
        self._projects[project.id] = project
        return project

    def update(
        self, project_id: UUID, update_data: ProjectUpdate
    ) -> Optional[Project]:
        """
        Update an existing project.

        Args:
            project_id: The UUID of the project to update
            update_data: The fields to update (only non-None values are applied)

        Returns:
            The updated project if found, None otherwise
        """
        project = self._projects.get(project_id)
        if project is None:
            return None

        # Build update dict with only provided fields
        update_dict = update_data.model_dump(exclude_unset=True, exclude_none=True)
        update_dict["updated_at"] = datetime.now(timezone.utc)

        # Create updated project
        updated_project = project.model_copy(update=update_dict)
        self._projects[project_id] = updated_project

        return updated_project

    def delete(self, project_id: UUID) -> bool:
        """
        Delete a project by its ID.

        Args:
            project_id: The UUID of the project to delete

        Returns:
            True if the project was deleted, False if not found
        """
        if project_id in self._projects:
            del self._projects[project_id]
            return True
        return False
