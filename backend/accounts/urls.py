from django.urls import path

from accounts import views

urlpatterns = [
    path('auth/register', views.RegisterView.as_view(), name='auth-register'),
    path('auth/login', views.LoginView.as_view(), name='auth-login'),
    path('auth/logout', views.LogoutView.as_view(), name='auth-logout'),
    path('auth/me', views.MeView.as_view(), name='auth-me'),
    path('auth/password-reset', views.PasswordResetView.as_view(), name='auth-password-reset'),
    path('health', views.health, name='health'),
]
