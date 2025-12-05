# tests/test_health.py
"""Tests for health check endpoint (Feature 18)."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


class TestHealthEndpoint:
    """Tests for GET /health endpoint."""

    def test_health_returns_200(self, client):
        """Health endpoint should return 200 OK."""
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_returns_status_healthy(self, client):
        """Health endpoint should return status 'healthy'."""
        response = client.get("/health")
        data = response.json()
        assert data["status"] == "healthy"

    def test_health_returns_version(self, client):
        """Health endpoint should return version."""
        response = client.get("/health")
        data = response.json()
        assert "version" in data
        assert data["version"] == "1.0.0"

    def test_health_returns_timestamp(self, client):
        """Health endpoint should return timestamp."""
        response = client.get("/health")
        data = response.json()
        assert "timestamp" in data
        # Timestamp should be in ISO format
        assert "T" in data["timestamp"] or "-" in data["timestamp"]

    def test_health_returns_json(self, client):
        """Health endpoint should return JSON content type."""
        response = client.get("/health")
        assert "application/json" in response.headers["content-type"]

    def test_health_not_under_api_v1(self, client):
        """Health endpoint should be at /health, not /api/v1/health."""
        # /health should work
        response = client.get("/health")
        assert response.status_code == 200

        # /api/v1/health should not exist
        response = client.get("/api/v1/health")
        assert response.status_code == 404
