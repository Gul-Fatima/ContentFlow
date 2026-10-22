"""Uniform JSON error envelope for the whole API.

Every error response is shaped as:

    {"code": "...", "message": "...", "fields": {...}?}

so the Expo client can branch on `code` instead of parsing prose.
"""
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.exceptions import (
    APIException,
    AuthenticationFailed,
    NotAuthenticated,
    Throttled,
    ValidationError,
)
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


class EmailTaken(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'An account with this email already exists.'
    default_code = 'email_taken'


class InvalidCredentials(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Incorrect email or password.'
    default_code = 'invalid_credentials'


def _message(value) -> str:
    """Flatten DRF's nested error detail into a single readable string."""
    if isinstance(value, dict):
        return ' '.join(_message(item) for item in value.values())
    if isinstance(value, (list, tuple)):
        return ' '.join(_message(item) for item in value)
    return str(value)


def _field_errors(detail) -> dict[str, list[str]]:
    if isinstance(detail, dict):
        return {
            str(field): [_message(item) for item in (value if isinstance(value, (list, tuple)) else [value])]
            for field, value in detail.items()
        }
    return {'non_field_errors': [_message(detail)]}


def api_exception_handler(exc, context):
    if isinstance(exc, Throttled):
        response = Response(
            {'code': 'RATE_LIMITED', 'message': 'Too many attempts. Try again in a minute.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )
        if exc.wait is not None:
            response['Retry-After'] = str(int(exc.wait))
        return response

    if isinstance(exc, InvalidCredentials):
        return Response(
            {'code': 'INVALID_CREDENTIALS', 'message': str(exc.detail)},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if isinstance(exc, EmailTaken):
        return Response(
            {'code': 'EMAIL_TAKEN', 'message': str(exc.detail)},
            status=status.HTTP_409_CONFLICT,
        )

    # Feature apps (e.g. billing) declare their machine-readable code as
    # `api_code` on an APIException, so the envelope stays uniform without this
    # module importing them.
    api_code = getattr(exc, 'api_code', None)
    if isinstance(exc, APIException) and api_code:
        return Response(
            {'code': api_code, 'message': str(exc.detail)},
            status=exc.status_code,
        )

    if isinstance(exc, ValidationError):
        return Response(
            {
                'code': 'VALIDATION',
                'message': 'Please check the highlighted fields.',
                'fields': _field_errors(exc.detail),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(exc, DjangoValidationError):
        detail = exc.message_dict if hasattr(exc, 'message_dict') else exc.messages
        return Response(
            {
                'code': 'VALIDATION',
                'message': 'Please check the highlighted fields.',
                'fields': _field_errors(detail),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
        response = Response(
            {'code': 'UNAUTHENTICATED', 'message': 'Authentication required.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )
        if getattr(exc, 'auth_header', None):
            response['WWW-Authenticate'] = exc.auth_header
        return response

    response = drf_exception_handler(exc, context)
    if response is None:
        # Unhandled exception: never leak internals (or a traceback) to clients.
        return Response(
            {'code': 'UNKNOWN', 'message': 'Something went wrong.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(
        {'code': 'UNKNOWN', 'message': 'Something went wrong.'},
        status=response.status_code,
    )
