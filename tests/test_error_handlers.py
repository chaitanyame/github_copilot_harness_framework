# tests/test_error_handlers.py
"""Tests for error handler middleware (Features 14, 15, 16, 17)."""

import pytest
from fastapi.testclient import TestClient

from src.data.store import MockDataStore
from src.main import app


@pytest.fixture
def client():
    """Create test client with fresh data store."""
    MockDataStore().reset()
    return TestClient(app, raise_server_exceptions=False)


class TestErrorResponseFormat:
    """Tests for consistent error response format (Feature 14)."""

    def test_404_returns_error_object_with_code(self, client):
        """404 response should include error.code field."""
        response = client.get("/api/v1/projects/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
        assert "code" in data["error"]

    def test_404_returns_error_object_with_message(self, client):
        """404 response should include error.message field."""
        response = client.get("/api/v1/projects/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
        assert "message" in data["error"]

    def test_404_error_code_is_not_found(self, client):
        """404 response error.code should be 'NOT_FOUND'."""
        response = client.get("/api/v1/projects/00000000-0000-0000-0000-000000000000")
        data = response.json()
        assert data["error"]["code"] == "NOT_FOUND"

    def test_422_returns_error_object_with_code(self, client):
        """422 response should include error.code field."""
        response = client.post("/api/v1/projects", json={})
        assert response.status_code == 422
        data = response.json()
        assert "error" in data
        assert "code" in data["error"]

    def test_422_error_code_is_validation_error(self, client):
        """422 response error.code should be 'VALIDATION_ERROR'."""
        response = client.post("/api/v1/projects", json={})
        data = response.json()
        assert data["error"]["code"] == "VALIDATION_ERROR"


class TestValidationErrorDetails:
    """Tests for validation error field details (Feature 15)."""

    def test_missing_field_error_includes_field_name(self, client):
        """Validation error should include the missing field name."""
        response = client.post("/api/v1/projects", json={"owner": "test@test.com"})
        assert response.status_code == 422
        data = response.json()
        assert "error" in data
        assert "details" in data["error"]
        # Check that 'name' is mentioned in errors
        details = data["error"]["details"]
        assert any("name" in str(err).lower() for err in details)

    def test_multiple_missing_fields_returns_all_errors(self, client):
        """Validation should return all field errors, not just first."""
        response = client.post("/api/v1/projects", json={})
        assert response.status_code == 422
        data = response.json()
        details = data["error"]["details"]
        # Should have errors for both name and owner
        error_fields = [err.get("field", err.get("loc", [""])[-1]) for err in details]
        assert "name" in error_fields or any("name" in str(f) for f in error_fields)
        assert "owner" in error_fields or any("owner" in str(f) for f in error_fields)

    def test_validation_error_has_message_per_field(self, client):
        """Each field error should have a message."""
        response = client.post("/api/v1/projects", json={})
        assert response.status_code == 422
        data = response.json()
        details = data["error"]["details"]
        for err in details:
            assert "message" in err or "msg" in err


class TestConsistent404Format:
    """Tests for consistent 404 format across endpoints (Feature 16)."""

    def test_get_project_404_has_standard_format(self, client):
        """GET /projects/{id} 404 should use standard format."""
        response = client.get("/api/v1/projects/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
        assert data["error"]["code"] == "NOT_FOUND"
        assert "message" in data["error"]

    def test_put_project_404_has_standard_format(self, client):
        """PUT /projects/{id} 404 should use standard format."""
        response = client.put(
            "/api/v1/projects/00000000-0000-0000-0000-000000000000",
            json={"name": "Updated"},
        )
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
        assert data["error"]["code"] == "NOT_FOUND"
        assert "message" in data["error"]

    def test_delete_project_404_has_standard_format(self, client):
        """DELETE /projects/{id} 404 should use standard format."""
        response = client.delete("/api/v1/projects/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
        assert data["error"]["code"] == "NOT_FOUND"
        assert "message" in data["error"]

    def test_404_includes_resource_id_in_message(self, client):
        """404 message should include the requested ID."""
        bad_id = "00000000-0000-0000-0000-000000000000"
        response = client.get(f"/api/v1/projects/{bad_id}")
        assert response.status_code == 404
        data = response.json()
        assert bad_id in data["error"]["message"]


class TestEdgeCaseValidation:
    """Tests for validation edge cases (Feature 17)."""

    def test_invalid_json_returns_400_or_422(self, client):
        """Invalid JSON body should return 400 or 422."""
        response = client.post(
            "/api/v1/projects",
            content="not valid json",
            headers={"Content-Type": "application/json"},
        )
        assert response.status_code in (400, 422)
        data = response.json()
        assert "error" in data

    def test_invalid_uuid_in_path_returns_422(self, client):
        """Invalid UUID format should return 422."""
        response = client.get("/api/v1/projects/not-a-uuid")
        assert response.status_code == 422
        data = response.json()
        assert "error" in data

    def test_name_exactly_100_chars_is_valid(self, client):
        """Name with exactly 100 characters should be accepted."""
        response = client.post(
            "/api/v1/projects",
            json={"name": "a" * 100, "owner": "test@test.com"},
        )
        assert response.status_code == 201

    def test_name_101_chars_returns_422(self, client):
        """Name with 101 characters should be rejected."""
        response = client.post(
            "/api/v1/projects",
            json={"name": "a" * 101, "owner": "test@test.com"},
        )
        assert response.status_code == 422
        data = response.json()
        assert "error" in data

    def test_description_exactly_1000_chars_is_valid(self, client):
        """Description with exactly 1000 characters should be accepted."""
        response = client.post(
            "/api/v1/projects",
            json={
                "name": "Test Project",
                "owner": "test@test.com",
                "description": "d" * 1000,
            },
        )
        assert response.status_code == 201

    def test_description_1001_chars_returns_422(self, client):
        """Description with 1001 characters should be rejected."""
        response = client.post(
            "/api/v1/projects",
            json={
                "name": "Test Project",
                "owner": "test@test.com",
                "description": "d" * 1001,
            },
        )
        assert response.status_code == 422
        data = response.json()
        assert "error" in data

    def test_empty_request_body_returns_422(self, client):
        """Empty request body should return 422."""
        response = client.post(
            "/api/v1/projects",
            content="",
            headers={"Content-Type": "application/json"},
        )
        # Empty body is treated as invalid JSON
        assert response.status_code in (400, 422)

    def test_null_request_body_returns_422(self, client):
        """Null request body should return 422."""
        response = client.post(
            "/api/v1/projects",
            json=None,
        )
        assert response.status_code == 422
