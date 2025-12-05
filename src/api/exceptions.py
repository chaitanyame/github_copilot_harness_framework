# src/api/exceptions.py
"""Custom exception classes for API error handling."""

from typing import Any


class APIException(Exception):
    """Base exception class for all API errors.

    Attributes:
        code: Machine-readable error code (e.g., "NOT_FOUND", "VALIDATION_ERROR")
        message: Human-readable error message
        status_code: HTTP status code for the response
        details: Optional additional error details
    """

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 500,
        details: dict[str, Any] | None = None,
    ) -> None:
        """Initialize APIException.

        Args:
            code: Machine-readable error code
            message: Human-readable error message
            status_code: HTTP status code (default: 500)
            details: Optional additional error details
        """
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details


class NotFoundException(APIException):
    """Exception for 404 Not Found errors."""

    def __init__(
        self,
        message: str,
        code: str = "NOT_FOUND",
        details: dict[str, Any] | None = None,
    ) -> None:
        """Initialize NotFoundException.

        Args:
            message: Human-readable error message
            code: Machine-readable error code (default: "NOT_FOUND")
            details: Optional additional error details
        """
        super().__init__(
            code=code,
            message=message,
            status_code=404,
            details=details,
        )


class ValidationException(APIException):
    """Exception for 422 Validation errors."""

    def __init__(
        self,
        message: str,
        code: str = "VALIDATION_ERROR",
        details: dict[str, Any] | None = None,
    ) -> None:
        """Initialize ValidationException.

        Args:
            message: Human-readable error message
            code: Machine-readable error code (default: "VALIDATION_ERROR")
            details: Optional additional error details (e.g., field-level errors)
        """
        super().__init__(
            code=code,
            message=message,
            status_code=422,
            details=details,
        )


class BadRequestException(APIException):
    """Exception for 400 Bad Request errors."""

    def __init__(
        self,
        message: str,
        code: str = "BAD_REQUEST",
        details: dict[str, Any] | None = None,
    ) -> None:
        """Initialize BadRequestException.

        Args:
            message: Human-readable error message
            code: Machine-readable error code (default: "BAD_REQUEST")
            details: Optional additional error details
        """
        super().__init__(
            code=code,
            message=message,
            status_code=400,
            details=details,
        )


class InternalServerErrorException(APIException):
    """Exception for 500 Internal Server errors."""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        details: dict[str, Any] | None = None,
    ) -> None:
        """Initialize InternalServerErrorException.

        Args:
            message: Human-readable error message
            code: Machine-readable error code (default: "INTERNAL_ERROR")
            details: Optional additional error details
        """
        super().__init__(
            code=code,
            message=message,
            status_code=500,
            details=details,
        )
