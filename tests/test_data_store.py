# tests/test_data_store.py
"""
TDD Tests for Feature 4: MockDataStore
TDD Tests for Feature 5: Seed Data Generator

These tests are written FIRST (Red phase) before implementation.
"""

from datetime import datetime, timezone
from uuid import UUID

import pytest


class TestMockDataStoreSingleton:
    """Tests for MockDataStore singleton pattern."""

    def test_get_instance_returns_store(self):
        """get_instance() should return a MockDataStore instance."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        assert store is not None
        assert isinstance(store, MockDataStore)

    def test_singleton_returns_same_instance(self):
        """get_instance() should always return the same instance."""
        from src.data.store import MockDataStore

        store1 = MockDataStore.get_instance()
        store2 = MockDataStore.get_instance()
        assert store1 is store2

    def test_reset_clears_and_reseeds_data(self):
        """reset() should clear data and reseed."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        _, initial_count = store.get_all()

        # Delete a project
        projects, _ = store.get_all()
        if projects:
            store.delete(projects[0].id)

        # Reset should restore
        store.reset()
        _, reset_count = store.get_all()
        assert reset_count == initial_count


class TestMockDataStoreGetAll:
    """Tests for get_all() method."""

    def test_get_all_returns_list(self):
        """get_all() should return a tuple of (list of projects, total count)."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        store.reset()
        projects, total = store.get_all()
        assert isinstance(projects, list)
        assert isinstance(total, int)

    def test_get_all_with_limit(self):
        """get_all(limit=N) should return at most N projects."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        store.reset()
        projects = store.get_all(limit=5)
        assert len(projects) <= 5

    def test_get_all_with_offset(self):
        """get_all(offset=N) should skip first N projects."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        store.reset()
        all_projects = store.get_all()
        offset_projects = store.get_all(offset=5)

        if len(all_projects) > 5:
            assert offset_projects[0].id == all_projects[5].id

    def test_get_all_with_status_filter(self):
        """get_all(status='active') should filter by status."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectStatus

        store = MockDataStore.get_instance()
        store.reset()
        active_projects, _ = store.get_all(status=ProjectStatus.ACTIVE)

        for project in active_projects:
            assert project.status == ProjectStatus.ACTIVE

    def test_get_all_returns_total_count(self):
        """get_all() should return (projects, total_count) tuple."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        store.reset()
        projects, total = store.get_all(limit=5)

        assert isinstance(projects, list)
        assert isinstance(total, int)
        assert total >= len(projects)


class TestMockDataStoreGetById:
    """Tests for get_by_id() method."""

    def test_get_by_id_returns_project(self):
        """get_by_id(id) should return the project with that ID."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        store.reset()
        projects, _ = store.get_all(limit=1)
        project_id = projects[0].id

        found = store.get_by_id(project_id)
        assert found is not None
        assert found.id == project_id

    def test_get_by_id_returns_none_for_nonexistent(self):
        """get_by_id(id) should return None if not found."""
        from uuid import uuid4

        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        found = store.get_by_id(uuid4())
        assert found is None


class TestMockDataStoreCreate:
    """Tests for create() method."""

    def test_create_generates_uuid(self):
        """create() should generate a UUID for the new project."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectCreate

        store = MockDataStore.get_instance()
        store.reset()

        new_project = ProjectCreate(
            name="TDD Test Project", owner="tdd.user", description="Created via TDD"
        )
        created = store.create(new_project)

        assert created.id is not None
        assert isinstance(created.id, UUID)

    def test_create_sets_timestamps(self):
        """create() should set created_at and updated_at timestamps."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectCreate

        store = MockDataStore.get_instance()
        store.reset()

        before = datetime.now(timezone.utc)
        new_project = ProjectCreate(name="Timestamp Test", owner="user")
        created = store.create(new_project)
        after = datetime.now(timezone.utc)

        assert before <= created.created_at <= after
        assert created.created_at == created.updated_at

    def test_create_returns_full_project(self):
        """create() should return a complete Project model."""
        from src.data.store import MockDataStore
        from src.models.project import Project, ProjectCreate

        store = MockDataStore.get_instance()
        store.reset()

        new_project = ProjectCreate(name="Full Project", owner="user")
        created = store.create(new_project)

        assert isinstance(created, Project)
        assert created.name == "Full Project"
        assert created.owner == "user"


class TestMockDataStoreUpdate:
    """Tests for update() method."""

    def test_update_modifies_fields(self):
        """update(id, data) should modify specified fields."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectUpdate

        store = MockDataStore.get_instance()
        store.reset()
        projects, _ = store.get_all(limit=1)
        project_id = projects[0].id

        update_data = ProjectUpdate(name="Updated Name")
        updated = store.update(project_id, update_data)

        assert updated is not None
        assert updated.name == "Updated Name"

    def test_update_sets_updated_at(self):
        """update() should update the updated_at timestamp."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectUpdate

        store = MockDataStore.get_instance()
        store.reset()
        projects, _ = store.get_all(limit=1)
        project = projects[0]
        original_updated_at = project.updated_at

        update_data = ProjectUpdate(name="New Name")
        updated = store.update(project.id, update_data)

        assert updated.updated_at > original_updated_at

    def test_update_returns_none_for_nonexistent(self):
        """update() should return None if project not found."""
        from uuid import uuid4

        from src.data.store import MockDataStore
        from src.models.project import ProjectUpdate

        store = MockDataStore.get_instance()
        update_data = ProjectUpdate(name="Won't Work")
        result = store.update(uuid4(), update_data)

        assert result is None

    def test_update_preserves_unmodified_fields(self):
        """update() should not modify fields not in update data."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectUpdate

        store = MockDataStore.get_instance()
        store.reset()
        projects, _ = store.get_all(limit=1)
        original = projects[0]

        update_data = ProjectUpdate(name="Only Name Changed")
        updated = store.update(original.id, update_data)

        assert updated.description == original.description
        assert updated.owner == original.owner
        assert updated.status == original.status


class TestMockDataStoreDelete:
    """Tests for delete() method."""

    def test_delete_returns_true_on_success(self):
        """delete(id) should return True when project is deleted."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectCreate

        store = MockDataStore.get_instance()
        store.reset()

        # Create a project to delete
        new_project = ProjectCreate(name="To Be Deleted", owner="user")
        created = store.create(new_project)

        result = store.delete(created.id)
        assert result is True

    def test_delete_removes_project(self):
        """delete(id) should remove the project from the store."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectCreate

        store = MockDataStore.get_instance()
        store.reset()

        new_project = ProjectCreate(name="Will Be Gone", owner="user")
        created = store.create(new_project)
        project_id = created.id

        store.delete(project_id)
        found = store.get_by_id(project_id)

        assert found is None

    def test_delete_returns_false_for_nonexistent(self):
        """delete(id) should return False if project not found."""
        from uuid import uuid4

        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        result = store.delete(uuid4())
        assert result is False


class TestSeedData:
    """Tests for Feature 5: Seed Data Generator."""

    def test_seed_data_has_minimum_50_projects(self):
        """Seed data should have at least 50 projects."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        store.reset()
        _, total = store.get_all()

        assert total >= 50

    def test_seed_data_has_variety_of_statuses(self):
        """Seed data should include both active and archived projects."""
        from src.data.store import MockDataStore
        from src.models.project import ProjectStatus

        store = MockDataStore.get_instance()
        store.reset()

        active, _ = store.get_all(status=ProjectStatus.ACTIVE)
        archived, _ = store.get_all(status=ProjectStatus.ARCHIVED)

        assert len(active) > 0
        assert len(archived) > 0

    def test_seed_data_has_realistic_names(self):
        """Seed data should have realistic project names."""
        from src.data.store import MockDataStore

        store = MockDataStore.get_instance()
        store.reset()
        projects, _ = store.get_all(limit=10)

        for project in projects:
            assert len(project.name) >= 3
            assert len(project.name) <= 100
