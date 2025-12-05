# tests/test_exceptions.py
"""Tests for custom exception classes (Feature 13)."""

import pytest


class TestAPIException:
    """Tests for the base APIException class."""

    def test_api_exception_has_code_attribute(self):
        """APIException should have a code attribute."""
        from src.api.exceptions import APIException

        exc = APIException(code="TEST_ERROR", message="Test error message")
        assert exc.code == "TEST_ERROR"

    def test_api_exception_has_message_attribute(self):
        """APIException should have a message attribute."""
        from src.api.exceptions import APIException

        exc = APIException(code="TEST_ERROR", message="Test error message")
        assert exc.message == "Test error message"

    def test_api_exception_has_status_code_attribute(self):
        """APIException should have a status_code attribute."""
        from src.api.exceptions import APIException

        exc = APIException(
            code="TEST_ERROR", message="Test error message", status_code=418
        )
        assert exc.status_code == 418

    def test_api_exception_default_status_code_is_500(self):
        """APIException should default to 500 status code."""
        from src.api.exceptions import APIException

        exc = APIException(code="TEST_ERROR", message="Test error message")
        assert exc.status_code == 500

    def test_api_exception_has_details_attribute(self):
        """APIException should have an optional details attribute."""
        from src.api.exceptions import APIException

        details = {"field": "name", "value": "test"}
        exc = APIException(
            code="TEST_ERROR", message="Test error message", details=details
        )
        assert exc.details == details

    def test_api_exception_default_details_is_none(self):
        """APIException should default to None for details."""
        from src.api.exceptions import APIException

        exc = APIException(code="TEST_ERROR", message="Test error message")
        assert exc.details is None


class TestNotFoundException:
    """Tests for NotFoundException (404 errors)."""

    def test_not_found_exception_has_404_status_code(self):
        """NotFoundException should have 404 status code."""
        from src.api.exceptions import NotFoundException

        exc = NotFoundException(message="Resource not found")
        assert exc.status_code == 404

    def test_not_found_exception_has_not_found_code(self):
        """NotFoundException should have NOT_FOUND code."""
        from src.api.exceptions import NotFoundException

        exc = NotFoundException(message="Resource not found")
        assert exc.code == "NOT_FOUND"

    def test_not_found_exception_with_custom_code(self):
        """NotFoundException should accept custom code."""
        from src.api.exceptions import NotFoundException

        exc = NotFoundException(code="PROJECT_NOT_FOUND", message="Project not found")
        assert exc.code == "PROJECT_NOT_FOUND"

    def test_not_found_exception_with_resource_id(self):
        """NotFoundException should include resource ID in details."""
        from src.api.exceptions import NotFoundException

        exc = NotFoundException(
            message="Project not found",
            details={"resource_id": "123e4567-e89b-12d3-a456-426614174000"},
        )
        assert exc.details["resource_id"] == "123e4567-e89b-12d3-a456-426614174000"


class TestValidationException:
    """Tests for ValidationException (422 errors)."""

    def test_validation_exception_has_422_status_code(self):
        """ValidationException should have 422 status code."""
        from src.api.exceptions import ValidationException

        exc = ValidationException(message="Validation failed")
        assert exc.status_code == 422

    def test_validation_exception_has_validation_error_code(self):
        """ValidationException should have VALIDATION_ERROR code."""
        from src.api.exceptions import ValidationException

        exc = ValidationException(message="Validation failed")
        assert exc.code == "VALIDATION_ERROR"

    def test_validation_exception_with_field_errors(self):
        """ValidationException should include field-level errors."""
        from src.api.exceptions import ValidationException

        field_errors = [
            {"field": "name", "message": "Field is required"},
            {"field": "owner", "message": "Field is required"},
        ]
        exc = ValidationException(
            message="Validation failed", details={"errors": field_errors}
        )
        assert len(exc.details["errors"]) == 2


class TestBadRequestException:
    """Tests for BadRequestException (400 errors)."""

    def test_bad_request_exception_has_400_status_code(self):
        """BadRequestException should have 400 status code."""
        from src.api.exceptions import BadRequestException

        exc = BadRequestException(message="Invalid request")
        assert exc.status_code == 400

    def test_bad_request_exception_has_bad_request_code(self):
        """BadRequestException should have BAD_REQUEST code."""
        from src.api.exceptions import BadRequestException

        exc = BadRequestException(message="Invalid request")
        assert exc.code == "BAD_REQUEST"

    def test_bad_request_exception_with_custom_code(self):
        """BadRequestException should accept custom code."""
        from src.api.exceptions import BadRequestException

        exc = BadRequestException(code="INVALID_JSON", message="Invalid JSON body")
        assert exc.code == "INVALID_JSON"


class TestInternalServerErrorException:
    """Tests for InternalServerErrorException (500 errors)."""

    def test_internal_error_exception_has_500_status_code(self):
        """InternalServerErrorException should have 500 status code."""
        from src.api.exceptions import InternalServerErrorException

        exc = InternalServerErrorException(message="Internal error")
        assert exc.status_code == 500

    def test_internal_error_exception_has_internal_error_code(self):
        """InternalServerErrorException should have INTERNAL_ERROR code."""
        from src.api.exceptions import InternalServerErrorException

        exc = InternalServerErrorException(message="Internal error")
        assert exc.code == "INTERNAL_ERROR"
