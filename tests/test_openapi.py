# tests/test_openapi.py
"""Tests for OpenAPI documentation (Features 19, 20, 21)."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


class TestOpenAPIMetadata:
    """Tests for OpenAPI metadata configuration (Feature 19)."""

    def test_openapi_has_title(self, client):
        """OpenAPI spec should have 'Projects API' title."""
        response = client.get("/openapi.json")
        data = response.json()
        assert data["info"]["title"] == "Projects API"

    def test_openapi_has_description(self, client):
        """OpenAPI spec should have a description."""
        response = client.get("/openapi.json")
        data = response.json()
        assert "description" in data["info"]
        assert len(data["info"]["description"]) > 20

    def test_openapi_has_version(self, client):
        """OpenAPI spec should have version 1.0.0."""
        response = client.get("/openapi.json")
        data = response.json()
        assert data["info"]["version"] == "1.0.0"

    def test_openapi_has_tags(self, client):
        """OpenAPI spec should have tags defined."""
        response = client.get("/openapi.json")
        data = response.json()
        assert "tags" in data
        tag_names = [t["name"] for t in data["tags"]]
        assert "Projects" in tag_names
        assert "Health" in tag_names

    def test_openapi_has_servers(self, client):
        """OpenAPI spec should have servers defined."""
        response = client.get("/openapi.json")
        data = response.json()
        assert "servers" in data
        assert len(data["servers"]) > 0
        # Should include localhost
        urls = [s["url"] for s in data["servers"]]
        assert any("localhost" in url for url in urls)

    def test_endpoints_have_operation_ids(self, client):
        """All endpoints should have operationId."""
        response = client.get("/openapi.json")
        data = response.json()
        
        for path, methods in data["paths"].items():
            for method, details in methods.items():
                if method in ["get", "post", "put", "delete", "patch"]:
                    assert "operationId" in details, f"{method.upper()} {path} missing operationId"


class TestSwaggerUI:
    """Tests for Swagger UI functionality (Feature 21)."""

    def test_docs_endpoint_returns_200(self, client):
        """GET /docs should return 200 OK."""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_docs_returns_html(self, client):
        """/docs should return HTML content."""
        response = client.get("/docs")
        assert "text/html" in response.headers["content-type"]

    def test_docs_contains_swagger(self, client):
        """/docs should contain Swagger UI."""
        response = client.get("/docs")
        assert "swagger" in response.text.lower()

    def test_redoc_endpoint_returns_200(self, client):
        """GET /redoc should return 200 OK."""
        response = client.get("/redoc")
        assert response.status_code == 200

    def test_redoc_returns_html(self, client):
        """/redoc should return HTML content."""
        response = client.get("/redoc")
        assert "text/html" in response.headers["content-type"]

    def test_openapi_json_accessible(self, client):
        """OpenAPI JSON spec should be accessible."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]

    def test_all_project_endpoints_in_openapi(self, client):
        """All project CRUD endpoints should be in OpenAPI spec."""
        response = client.get("/openapi.json")
        data = response.json()
        paths = data["paths"]
        
        # Check CRUD endpoints exist
        assert "/api/v1/projects" in paths
        assert "/api/v1/projects/{project_id}" in paths
        
        # Check methods
        assert "get" in paths["/api/v1/projects"]
        assert "post" in paths["/api/v1/projects"]
        assert "get" in paths["/api/v1/projects/{project_id}"]
        assert "put" in paths["/api/v1/projects/{project_id}"]
        assert "delete" in paths["/api/v1/projects/{project_id}"]

    def test_endpoints_have_summaries(self, client):
        """Endpoints should have summaries."""
        response = client.get("/openapi.json")
        data = response.json()
        
        for path, methods in data["paths"].items():
            for method, details in methods.items():
                if method in ["get", "post", "put", "delete"]:
                    assert "summary" in details, f"{method.upper()} {path} missing summary"
