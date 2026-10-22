from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from accounts.exceptions import EmailTaken
from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    """Public user shape: camelCase keys for the Expo client."""

    avatarUrl = serializers.CharField(source='avatar_url', allow_blank=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'company', 'avatarUrl')


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=120)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    def validate_name(self, value: str) -> str:
        name = value.strip()
        if len(name) < 2:
            raise serializers.ValidationError('Enter your full name (at least 2 characters).')
        return name

    def validate_email(self, value: str) -> str:
        email = value.strip().lower()
        # 409 EMAIL_TAKEN instead of a field error, see docs/AUTH_CONTRACT.md.
        if User.objects.filter(email__iexact=email).exists():
            raise EmailTaken()
        return email

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    def create(self, validated_data) -> User:
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_email(self, value: str) -> str:
        return value.strip().lower()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value: str) -> str:
        return value.strip().lower()
