# tests/conftest.py
"""Pytest configuration and fixtures."""

import pytest
from fastapi.testclient import TestClient

from src.main import app
from src.data.store import MockDataStore


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    # Reset data store before each test
    MockDataStore.get_instance().reset()
    return TestClient(app)


@pytest.fixture
def sample_project_data():
    """Valid project creation data."""
    return {
        "name": "Test Project",
        "description": "A test project for unit testing",
        "status": "active",
        "owner": "test.user",
    }


@pytest.fixture
def invalid_project_data_empty_name():
    """Invalid project data with empty name."""
    return {
        "name": "",
        "description": "A test project",
        "owner": "test.user",
    }


@pytest.fixture
def invalid_project_data_long_name():
    """Invalid project data with name exceeding 100 chars."""
    return {
        "name": "x" * 101,
        "description": "A test project",
        "owner": "test.user",
    }


@pytest.fixture
def invalid_project_data_long_description():
    """Invalid project data with description exceeding 1000 chars."""
    return {
        "name": "Valid Name",
        "description": "x" * 1001,
        "owner": "test.user",
    }
