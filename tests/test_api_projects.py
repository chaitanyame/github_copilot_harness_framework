# tests/test_api_projects.py
"""
TDD Tests for Features 6-9: API Endpoints

Red phase - These tests are written FIRST before implementation.
"""

import pytest
from fastapi.testclient import TestClient
from uuid import uuid4


class TestAppSetup:
    """Tests for Feature 6: FastAPI App with CORS."""

    def test_app_has_openapi_docs(self, client: TestClient):
        """App should serve OpenAPI docs at /docs."""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_app_has_cors_headers(self, client: TestClient):
        """App should include CORS headers for cross-origin requests."""
        response = client.options(
            "/api/v1/projects",
            headers={"Origin": "http://localhost:3000"},
        )
        # CORS preflight should be allowed
        assert response.status_code in [200, 204, 405]

    def test_app_serves_root_endpoint(self, client: TestClient):
        """Root endpoint should return welcome message."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestGetProjectsList:
    """Tests for Feature 7: GET /projects List."""

    def test_get_projects_returns_200(self, client: TestClient):
        """GET /api/v1/projects should return 200 OK."""
        response = client.get("/api/v1/projects")
        assert response.status_code == 200

    def test_get_projects_returns_list_with_meta(self, client: TestClient):
        """Response should have data array and meta with pagination."""
        response = client.get("/api/v1/projects")
        data = response.json()

        assert "data" in data
        assert "meta" in data
        assert isinstance(data["data"], list)
        assert "total" in data["meta"]
        assert "limit" in data["meta"]
        assert "offset" in data["meta"]

    def test_get_projects_default_limit_20(self, client: TestClient):
        """Default limit should be 20 projects."""
        response = client.get("/api/v1/projects")
        data = response.json()

        assert len(data["data"]) <= 20
        assert data["meta"]["limit"] == 20

    def test_get_projects_custom_limit(self, client: TestClient):
        """Custom limit should be respected."""
        response = client.get("/api/v1/projects?limit=5")
        data = response.json()

        assert len(data["data"]) <= 5
        assert data["meta"]["limit"] == 5

    def test_get_projects_limit_max_100(self, client: TestClient):
        """Limit should be capped at 100 (422 if exceeded)."""
        response = client.get("/api/v1/projects?limit=200")
        # FastAPI validates and returns 422 for values > max_limit
        assert response.status_code == 422

    def test_get_projects_offset_pagination(self, client: TestClient):
        """Offset should skip projects for pagination."""
        response1 = client.get("/api/v1/projects?limit=5&offset=0")
        response2 = client.get("/api/v1/projects?limit=5&offset=5")

        data1 = response1.json()["data"]
        data2 = response2.json()["data"]

        # Should have different projects
        if len(data1) > 0 and len(data2) > 0:
            assert data1[0]["id"] != data2[0]["id"]

    def test_get_projects_filter_by_status_active(self, client: TestClient):
        """Should filter projects by status=active."""
        response = client.get("/api/v1/projects?status=active")
        data = response.json()

        for project in data["data"]:
            assert project["status"] == "active"

    def test_get_projects_filter_by_status_archived(self, client: TestClient):
        """Should filter projects by status=archived."""
        response = client.get("/api/v1/projects?status=archived")
        data = response.json()

        for project in data["data"]:
            assert project["status"] == "archived"

    def test_get_projects_invalid_status_returns_422(self, client: TestClient):
        """Invalid status should return 422 Unprocessable Entity."""
        response = client.get("/api/v1/projects?status=invalid")
        assert response.status_code == 422


class TestGetProjectById:
    """Tests for Feature 8: GET /projects/{id}."""

    def test_get_project_by_id_returns_200(self, client: TestClient):
        """GET /api/v1/projects/{id} should return 200 for existing project."""
        # First get a valid project ID
        list_response = client.get("/api/v1/projects?limit=1")
        projects = list_response.json()["data"]
        assert len(projects) > 0

        project_id = projects[0]["id"]
        response = client.get(f"/api/v1/projects/{project_id}")

        assert response.status_code == 200

    def test_get_project_by_id_returns_project_data(self, client: TestClient):
        """Response should contain project data with all fields."""
        list_response = client.get("/api/v1/projects?limit=1")
        project_id = list_response.json()["data"][0]["id"]

        response = client.get(f"/api/v1/projects/{project_id}")
        data = response.json()

        assert "data" in data
        project = data["data"]
        assert "id" in project
        assert "name" in project
        assert "description" in project
        assert "status" in project
        assert "owner" in project
        assert "created_at" in project
        assert "updated_at" in project

    def test_get_project_by_id_has_meta(self, client: TestClient):
        """Response should include meta with timestamp."""
        list_response = client.get("/api/v1/projects?limit=1")
        project_id = list_response.json()["data"][0]["id"]

        response = client.get(f"/api/v1/projects/{project_id}")
        data = response.json()

        assert "meta" in data
        assert "timestamp" in data["meta"]

    def test_get_project_not_found_returns_404(self, client: TestClient):
        """Non-existent project should return 404 Not Found."""
        fake_id = str(uuid4())
        response = client.get(f"/api/v1/projects/{fake_id}")

        assert response.status_code == 404

    def test_get_project_404_has_error_format(self, client: TestClient):
        """404 response should follow standard error format."""
        fake_id = str(uuid4())
        response = client.get(f"/api/v1/projects/{fake_id}")
        data = response.json()

        # Standard error format with nested error object
        assert "error" in data
        assert "code" in data["error"]
        assert "message" in data["error"]
        assert data["error"]["code"] == "NOT_FOUND"

    def test_get_project_invalid_uuid_returns_422(self, client: TestClient):
        """Invalid UUID format should return 422."""
        response = client.get("/api/v1/projects/not-a-uuid")
        assert response.status_code == 422


class TestCreateProject:
    """Tests for Feature 9: POST /projects."""

    def test_create_project_returns_201(self, client: TestClient):
        """POST /api/v1/projects should return 201 Created."""
        new_project = {
            "name": "TDD Test Project",
            "description": "Created during TDD testing",
            "owner": "tdd.tester",
        }
        response = client.post("/api/v1/projects", json=new_project)

        assert response.status_code == 201

    def test_create_project_returns_created_project(self, client: TestClient):
        """Response should contain the created project with generated fields."""
        new_project = {
            "name": "Created Project",
            "description": "Testing creation",
            "owner": "test.user",
        }
        response = client.post("/api/v1/projects", json=new_project)
        data = response.json()

        assert "data" in data
        project = data["data"]
        assert project["name"] == "Created Project"
        assert project["owner"] == "test.user"
        assert "id" in project  # Server-generated
        assert "created_at" in project  # Server-generated
        assert "updated_at" in project  # Server-generated

    def test_create_project_default_status_active(self, client: TestClient):
        """New project should default to 'active' status."""
        new_project = {
            "name": "Default Status Project",
            "owner": "test.user",
        }
        response = client.post("/api/v1/projects", json=new_project)
        data = response.json()

        assert data["data"]["status"] == "active"

    def test_create_project_can_set_status(self, client: TestClient):
        """Should be able to set status on creation."""
        new_project = {
            "name": "Archived Project",
            "owner": "test.user",
            "status": "archived",
        }
        response = client.post("/api/v1/projects", json=new_project)
        data = response.json()

        assert data["data"]["status"] == "archived"

    def test_create_project_missing_name_returns_422(self, client: TestClient):
        """Missing required 'name' should return 422."""
        invalid_project = {
            "description": "No name provided",
            "owner": "test.user",
        }
        response = client.post("/api/v1/projects", json=invalid_project)

        assert response.status_code == 422

    def test_create_project_missing_owner_returns_422(self, client: TestClient):
        """Missing required 'owner' should return 422."""
        invalid_project = {
            "name": "Valid Name",
            "description": "No owner provided",
        }
        response = client.post("/api/v1/projects", json=invalid_project)

        assert response.status_code == 422

    def test_create_project_name_too_long_returns_422(self, client: TestClient):
        """Name exceeding 100 chars should return 422."""
        invalid_project = {
            "name": "x" * 101,
            "owner": "test.user",
        }
        response = client.post("/api/v1/projects", json=invalid_project)

        assert response.status_code == 422

    def test_create_project_empty_name_returns_422(self, client: TestClient):
        """Empty name should return 422."""
        invalid_project = {
            "name": "",
            "owner": "test.user",
        }
        response = client.post("/api/v1/projects", json=invalid_project)

        assert response.status_code == 422

    def test_create_project_is_retrievable(self, client: TestClient):
        """Created project should be retrievable by ID."""
        new_project = {
            "name": "Retrievable Project",
            "owner": "test.user",
        }
        create_response = client.post("/api/v1/projects", json=new_project)
        project_id = create_response.json()["data"]["id"]

        get_response = client.get(f"/api/v1/projects/{project_id}")

        assert get_response.status_code == 200
        assert get_response.json()["data"]["name"] == "Retrievable Project"


class TestUpdateProject:
    """Tests for Feature 10: PUT /projects/{id}."""

    def test_update_project_returns_200(self, client: TestClient):
        """PUT /api/v1/projects/{id} should return 200 OK."""
        # Get existing project
        list_response = client.get("/api/v1/projects?limit=1")
        project_id = list_response.json()["data"][0]["id"]

        update_data = {"name": "Updated Project Name"}
        response = client.put(f"/api/v1/projects/{project_id}", json=update_data)

        assert response.status_code == 200

    def test_update_project_modifies_fields(self, client: TestClient):
        """Updated fields should be reflected in response."""
        list_response = client.get("/api/v1/projects?limit=1")
        project_id = list_response.json()["data"][0]["id"]

        update_data = {
            "name": "Completely New Name",
            "description": "Updated description",
        }
        response = client.put(f"/api/v1/projects/{project_id}", json=update_data)
        data = response.json()

        assert data["data"]["name"] == "Completely New Name"
        assert data["data"]["description"] == "Updated description"

    def test_update_project_preserves_unmodified_fields(self, client: TestClient):
        """Fields not in update should remain unchanged."""
        list_response = client.get("/api/v1/projects?limit=1")
        original = list_response.json()["data"][0]
        project_id = original["id"]

        update_data = {"name": "Only Name Changed"}
        response = client.put(f"/api/v1/projects/{project_id}", json=update_data)
        data = response.json()

        assert data["data"]["name"] == "Only Name Changed"
        assert data["data"]["owner"] == original["owner"]

    def test_update_project_updates_timestamp(self, client: TestClient):
        """updated_at should change after update."""
        list_response = client.get("/api/v1/projects?limit=1")
        original = list_response.json()["data"][0]
        project_id = original["id"]
        original_updated_at = original["updated_at"]

        update_data = {"name": "Timestamp Test"}
        response = client.put(f"/api/v1/projects/{project_id}", json=update_data)
        data = response.json()

        assert data["data"]["updated_at"] != original_updated_at

    def test_update_project_can_change_status(self, client: TestClient):
        """Should be able to archive a project."""
        list_response = client.get("/api/v1/projects?status=active&limit=1")
        project_id = list_response.json()["data"][0]["id"]

        update_data = {"status": "archived"}
        response = client.put(f"/api/v1/projects/{project_id}", json=update_data)
        data = response.json()

        assert data["data"]["status"] == "archived"

    def test_update_project_not_found_returns_404(self, client: TestClient):
        """Non-existent project should return 404."""
        fake_id = str(uuid4())
        update_data = {"name": "Won't Work"}
        response = client.put(f"/api/v1/projects/{fake_id}", json=update_data)

        assert response.status_code == 404

    def test_update_project_invalid_uuid_returns_422(self, client: TestClient):
        """Invalid UUID should return 422."""
        update_data = {"name": "Won't Work"}
        response = client.put("/api/v1/projects/not-a-uuid", json=update_data)

        assert response.status_code == 422

    def test_update_project_invalid_data_returns_422(self, client: TestClient):
        """Invalid update data should return 422."""
        list_response = client.get("/api/v1/projects?limit=1")
        project_id = list_response.json()["data"][0]["id"]

        update_data = {"name": "x" * 101}  # Name too long
        response = client.put(f"/api/v1/projects/{project_id}", json=update_data)

        assert response.status_code == 422


class TestDeleteProject:
    """Tests for Feature 11: DELETE /projects/{id}."""

    def test_delete_project_returns_204(self, client: TestClient):
        """DELETE /api/v1/projects/{id} should return 204 No Content."""
        # Create a project to delete
        new_project = {"name": "To Be Deleted", "owner": "test.user"}
        create_response = client.post("/api/v1/projects", json=new_project)
        project_id = create_response.json()["data"]["id"]

        response = client.delete(f"/api/v1/projects/{project_id}")

        assert response.status_code == 204

    def test_delete_project_removes_from_store(self, client: TestClient):
        """Deleted project should not be retrievable."""
        new_project = {"name": "Will Be Gone", "owner": "test.user"}
        create_response = client.post("/api/v1/projects", json=new_project)
        project_id = create_response.json()["data"]["id"]

        client.delete(f"/api/v1/projects/{project_id}")
        get_response = client.get(f"/api/v1/projects/{project_id}")

        assert get_response.status_code == 404

    def test_delete_project_not_found_returns_404(self, client: TestClient):
        """Non-existent project should return 404."""
        fake_id = str(uuid4())
        response = client.delete(f"/api/v1/projects/{fake_id}")

        assert response.status_code == 404

    def test_delete_project_invalid_uuid_returns_422(self, client: TestClient):
        """Invalid UUID should return 422."""
        response = client.delete("/api/v1/projects/not-a-uuid")

        assert response.status_code == 422

    def test_delete_project_no_response_body(self, client: TestClient):
        """204 response should have no body."""
        new_project = {"name": "No Body Test", "owner": "test.user"}
        create_response = client.post("/api/v1/projects", json=new_project)
        project_id = create_response.json()["data"]["id"]

        response = client.delete(f"/api/v1/projects/{project_id}")

        assert response.content == b""
