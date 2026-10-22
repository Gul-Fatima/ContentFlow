from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


def build_password_reset_url(user) -> str:
    """Return the frontend URL the user clicks to choose a new password."""
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    return f'{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}'


def send_password_reset_email(user) -> None:
    """Send the reset link. Never raises: callers must not learn if it failed."""
    reset_url = build_password_reset_url(user)
    send_mail(
        subject='Reset your ContentFlow password',
        message=(
            'We received a request to reset the password for your ContentFlow account.\n\n'
            f'Choose a new password here: {reset_url}\n\n'
            "If you didn't ask for this, you can ignore this email.\n"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=True,
    )
