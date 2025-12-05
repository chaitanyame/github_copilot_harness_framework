# tests/test_models.py
"""
TDD Tests for Feature 2: Project Pydantic Models
TDD Tests for Feature 3: Response Wrapper Models

These tests are written FIRST (Red phase) before implementation.
"""

from datetime import datetime, timezone
from uuid import uuid4

import pytest
from pydantic import ValidationError


class TestProjectStatus:
    """Tests for ProjectStatus enum."""

    def test_status_has_active_value(self):
        """ProjectStatus should have 'active' as a valid value."""
        from src.models.project import ProjectStatus

        assert ProjectStatus.ACTIVE.value == "active"

    def test_status_has_archived_value(self):
        """ProjectStatus should have 'archived' as a valid value."""
        from src.models.project import ProjectStatus

        assert ProjectStatus.ARCHIVED.value == "archived"

    def test_status_is_string_enum(self):
        """ProjectStatus should be a string enum for JSON serialization."""
        from src.models.project import ProjectStatus

        assert isinstance(ProjectStatus.ACTIVE, str)
        assert ProjectStatus.ACTIVE == "active"


class TestProjectCreate:
    """Tests for ProjectCreate request model validation."""

    def test_valid_project_create(self, sample_project_data):
        """ProjectCreate should accept valid data."""
        from src.models.project import ProjectCreate

        project = ProjectCreate(**sample_project_data)
        assert project.name == sample_project_data["name"]
        assert project.description == sample_project_data["description"]
        assert project.owner == sample_project_data["owner"]

    def test_rejects_empty_name(self, invalid_project_data_empty_name):
        """ProjectCreate should reject empty name."""
        from src.models.project import ProjectCreate

        with pytest.raises(ValidationError) as exc_info:
            ProjectCreate(**invalid_project_data_empty_name)
        assert "name" in str(exc_info.value).lower()

    def test_rejects_name_over_100_chars(self, invalid_project_data_long_name):
        """ProjectCreate should reject name longer than 100 characters."""
        from src.models.project import ProjectCreate

        with pytest.raises(ValidationError) as exc_info:
            ProjectCreate(**invalid_project_data_long_name)
        assert "name" in str(exc_info.value).lower()

    def test_rejects_description_over_1000_chars(
        self, invalid_project_data_long_description
    ):
        """ProjectCreate should reject description longer than 1000 characters."""
        from src.models.project import ProjectCreate

        with pytest.raises(ValidationError) as exc_info:
            ProjectCreate(**invalid_project_data_long_description)
        assert "description" in str(exc_info.value).lower()

    def test_description_is_optional_with_default_empty(self):
        """ProjectCreate should allow missing description, defaulting to empty."""
        from src.models.project import ProjectCreate

        project = ProjectCreate(name="Test", owner="user1")
        assert project.description == ""

    def test_status_defaults_to_active(self):
        """ProjectCreate should default status to 'active'."""
        from src.models.project import ProjectCreate, ProjectStatus

        project = ProjectCreate(name="Test", owner="user1")
        assert project.status == ProjectStatus.ACTIVE


class TestProjectUpdate:
    """Tests for ProjectUpdate request model (partial updates)."""

    def test_all_fields_optional(self):
        """ProjectUpdate should allow all fields to be None."""
        from src.models.project import ProjectUpdate

        update = ProjectUpdate()
        assert update.name is None
        assert update.description is None
        assert update.status is None
        assert update.owner is None

    def test_partial_update_name_only(self):
        """ProjectUpdate should allow updating only the name."""
        from src.models.project import ProjectUpdate

        update = ProjectUpdate(name="New Name")
        assert update.name == "New Name"
        assert update.description is None

    def test_validates_name_length_when_provided(self):
        """ProjectUpdate should validate name length when provided."""
        from src.models.project import ProjectUpdate

        with pytest.raises(ValidationError):
            ProjectUpdate(name="x" * 101)


class TestProject:
    """Tests for the complete Project model."""

    def test_project_has_all_required_fields(self):
        """Project should have all 7 required fields."""
        from src.models.project import Project, ProjectStatus

        now = datetime.now(timezone.utc)
        project = Project(
            id=uuid4(),
            name="Test Project",
            description="A test",
            status=ProjectStatus.ACTIVE,
            owner="user1",
            created_at=now,
            updated_at=now,
        )

        assert project.id is not None
        assert project.name == "Test Project"
        assert project.description == "A test"
        assert project.status == ProjectStatus.ACTIVE
        assert project.owner == "user1"
        assert project.created_at == now
        assert project.updated_at == now

    def test_project_serializes_to_json(self):
        """Project should serialize to JSON with proper field names."""
        from src.models.project import Project, ProjectStatus

        now = datetime.now(timezone.utc)
        project_id = uuid4()
        project = Project(
            id=project_id,
            name="Test",
            description="Desc",
            status=ProjectStatus.ACTIVE,
            owner="user1",
            created_at=now,
            updated_at=now,
        )

        json_dict = project.model_dump(mode="json")
        assert "id" in json_dict
        assert "name" in json_dict
        assert "status" in json_dict
        assert json_dict["status"] == "active"


class TestResponseMeta:
    """Tests for ResponseMeta model."""

    def test_response_meta_has_timestamp(self):
        """ResponseMeta should have a timestamp field."""
        from src.models.responses import ResponseMeta

        meta = ResponseMeta()
        assert meta.timestamp is not None
        assert isinstance(meta.timestamp, datetime)

    def test_timestamp_defaults_to_utc_now(self):
        """ResponseMeta timestamp should default to current UTC time."""
        from src.models.responses import ResponseMeta

        before = datetime.now(timezone.utc)
        meta = ResponseMeta()
        after = datetime.now(timezone.utc)

        assert before <= meta.timestamp <= after


class TestPaginationMeta:
    """Tests for PaginationMeta model."""

    def test_pagination_meta_has_required_fields(self):
        """PaginationMeta should have total, limit, offset, timestamp."""
        from src.models.responses import PaginationMeta

        meta = PaginationMeta(total=100, limit=20, offset=0)
        assert meta.total == 100
        assert meta.limit == 20
        assert meta.offset == 0
        assert meta.timestamp is not None

    def test_limit_must_be_between_1_and_100(self):
        """PaginationMeta limit should be between 1 and 100."""
        from src.models.responses import PaginationMeta

        # Valid limits
        PaginationMeta(total=10, limit=1, offset=0)
        PaginationMeta(total=10, limit=100, offset=0)

        # Invalid limits
        with pytest.raises(ValidationError):
            PaginationMeta(total=10, limit=0, offset=0)

        with pytest.raises(ValidationError):
            PaginationMeta(total=10, limit=101, offset=0)


class TestProjectResponse:
    """Tests for ProjectResponse wrapper."""

    def test_wraps_single_project(self):
        """ProjectResponse should wrap a single project with meta."""
        from src.models.project import Project, ProjectStatus
        from src.models.responses import ProjectResponse

        now = datetime.now(timezone.utc)
        project = Project(
            id=uuid4(),
            name="Test",
            description="",
            status=ProjectStatus.ACTIVE,
            owner="user1",
            created_at=now,
            updated_at=now,
        )

        response = ProjectResponse(data=project)
        assert response.data == project
        assert response.meta is not None
        assert response.meta.timestamp is not None


class TestProjectListResponse:
    """Tests for ProjectListResponse wrapper."""

    def test_wraps_project_list_with_pagination(self):
        """ProjectListResponse should wrap list with pagination meta."""
        from src.models.project import Project, ProjectStatus
        from src.models.responses import PaginationMeta, ProjectListResponse

        now = datetime.now(timezone.utc)
        projects = [
            Project(
                id=uuid4(),
                name=f"Project {i}",
                description="",
                status=ProjectStatus.ACTIVE,
                owner="user1",
                created_at=now,
                updated_at=now,
            )
            for i in range(3)
        ]

        meta = PaginationMeta(total=10, limit=20, offset=0)
        response = ProjectListResponse(data=projects, meta=meta)

        assert len(response.data) == 3
        assert response.meta.total == 10


class TestErrorResponse:
    """Tests for ErrorResponse model."""

    def test_error_response_structure(self):
        """ErrorResponse should have error, message, details, meta."""
        from src.models.responses import ErrorDetail, ErrorResponse

        error = ErrorResponse(
            error="validation_error",
            message="Request validation failed",
            details=[
                ErrorDetail(field="name", message="Field required", code="missing")
            ],
        )

        assert error.error == "validation_error"
        assert error.message == "Request validation failed"
        assert len(error.details) == 1
        assert error.details[0].field == "name"
        assert error.meta is not None
