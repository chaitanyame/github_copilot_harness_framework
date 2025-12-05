# src/config.py
"""Application configuration settings."""

from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = ConfigDict(env_prefix="API_")

    app_name: str = "Projects API"
    app_version: str = "1.0.0"
    debug: bool = False

    # CORS settings
    cors_origins: list[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]

    # Pagination defaults
    default_limit: int = 20
    max_limit: int = 100


settings = Settings()
