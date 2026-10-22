from django.contrib.auth import authenticate
from django.db import IntegrityError
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from accounts.exceptions import EmailTaken, InvalidCredentials
from accounts.models import User
from accounts.serializers import (
    LoginSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
)
from accounts.utils import send_password_reset_email

AUTH_THROTTLE_CLASSES = [ScopedRateThrottle]
AUTH_THROTTLE_SCOPE = 'auth'


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = AUTH_THROTTLE_CLASSES
    throttle_scope = AUTH_THROTTLE_SCOPE

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
        except IntegrityError:
            # Two concurrent sign-ups for the same email: the DB constraint wins.
            raise EmailTaken()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {'user': UserSerializer(user).data, 'token': token.key},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = AUTH_THROTTLE_CLASSES
    throttle_scope = AUTH_THROTTLE_SCOPE

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            request,
            username=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
        )
        # Unknown email, wrong password and inactive accounts all look the same.
        if user is None or not user.is_active:
            raise InvalidCredentials()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'user': UserSerializer(user).data, 'token': token.key})


class LogoutView(APIView):
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    def get(self, request):
        return Response({'user': UserSerializer(request.user).data})


class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = AUTH_THROTTLE_CLASSES
    throttle_scope = AUTH_THROTTLE_SCOPE

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        # Malformed input is deliberately ignored: the endpoint always answers
        # 200 so it can never be used to probe for accounts.
        if serializer.is_valid():
            user = User.objects.filter(
                email__iexact=serializer.validated_data['email'],
                is_active=True,
            ).first()
            if user is not None:
                send_password_reset_email(user)
        return Response({'sent': True}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({'status': 'ok'})
