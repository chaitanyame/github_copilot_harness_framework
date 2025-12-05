"""Projects API - FastAPI Application Entry Point."""

from fastapi import FastAPI

app = FastAPI(
    title="Projects API",
    description="RESTful API for managing projects with mock data",
    version="1.0.0",
)


@app.get("/")
def root():
    """Root endpoint - redirects to documentation."""
    return {"message": "Welcome to Projects API", "docs": "/docs"}
