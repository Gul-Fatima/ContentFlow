"""Django settings for the ContentFlow backend.

Every value that matters for deployment comes from the environment (see
.env.example). Local development works with zero configuration: DEBUG defaults
to False, so a real SECRET_KEY is required unless you copy .env.example to .env
and set DEBUG=True.
"""
import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env if present (local development convenience).
load_dotenv(BASE_DIR / '.env')


def env_list(name: str, default: str = '') -> list[str]:
    return [item.strip() for item in os.environ.get(name, default).split(',') if item.strip()]


DEBUG = os.environ.get('DEBUG', 'False').lower() in ('1', 'true', 'yes')

# Never fall back to a shared key in production: a missing SECRET_KEY is fatal
# unless we are explicitly in local debug mode.
SECRET_KEY = os.environ.get('SECRET_KEY', '')
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'django-insecure-local-dev-only-key'
    else:
        raise ImproperlyConfigured('SECRET_KEY must be set when DEBUG is False.')

ALLOWED_HOSTS = env_list('ALLOWED_HOSTS', 'localhost,127.0.0.1')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    # Local
    'accounts',
    'billing',
    'apps.core',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# --- Database -------------------------------------------------------------
# Postgres is configured through POSTGRES_* (used by docker-compose). A
# DATABASE_URL is still honoured for backwards compatibility. With neither set,
# local development falls back to SQLite.
POSTGRES_DB = os.environ.get('POSTGRES_DB', 'contentflow')
POSTGRES_USER = os.environ.get('POSTGRES_USER', 'contentflow')
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'contentflow')
POSTGRES_HOST = os.environ.get('POSTGRES_HOST', '')
POSTGRES_PORT = os.environ.get('POSTGRES_PORT', '5432')

DATABASE_URL = os.environ.get('DATABASE_URL', '')

if POSTGRES_HOST:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': POSTGRES_DB,
            'USER': POSTGRES_USER,
            'PASSWORD': POSTGRES_PASSWORD,
            'HOST': POSTGRES_HOST,
            'PORT': POSTGRES_PORT,
            'CONN_MAX_AGE': 600,
        }
    }
elif DATABASE_URL:
    DATABASES = {'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)}
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# --- Auth -----------------------------------------------------------------
AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- DRF ------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'auth': '10/min',
        'billing': '20/min',
    },
    'EXCEPTION_HANDLER': 'accounts.exceptions.api_exception_handler',
}

# --- CORS -----------------------------------------------------------------
CORS_ALLOWED_ORIGINS = env_list(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:8081,http://127.0.0.1:8081',
)

# --- Email ----------------------------------------------------------------
# Console backend in debug mode; set EMAIL_BACKEND + SMTP settings in production.
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND') or (
    'django.core.mail.backends.console.EmailBackend'
    if DEBUG
    else 'django.core.mail.backends.smtp.EmailBackend'
)
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'no-reply@contentflow.local')

# Base URL of the Expo app, used to build password-reset links.
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:8081').rstrip('/')

# --- Billing (Stripe) -----------------------------------------------------
# Hosted Checkout + Billing Portal only: card data never reaches this server.
# Leaving STRIPE_SECRET_KEY empty keeps the API up; billing endpoints that need
# Stripe then answer 503 PAYMENTS_NOT_CONFIGURED instead of crashing.
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')

STRIPE_PRICE_STARTER_MONTHLY = os.environ.get('STRIPE_PRICE_STARTER_MONTHLY', '')
STRIPE_PRICE_STARTER_YEARLY = os.environ.get('STRIPE_PRICE_STARTER_YEARLY', '')
STRIPE_PRICE_PRO_MONTHLY = os.environ.get('STRIPE_PRICE_PRO_MONTHLY', '')
STRIPE_PRICE_PRO_YEARLY = os.environ.get('STRIPE_PRICE_PRO_YEARLY', '')
STRIPE_PRICE_ENTERPRISE_MONTHLY = os.environ.get('STRIPE_PRICE_ENTERPRISE_MONTHLY', '')
STRIPE_PRICE_ENTERPRISE_YEARLY = os.environ.get('STRIPE_PRICE_ENTERPRISE_YEARLY', '')

# Public origin of THIS API, used for Stripe's success/cancel redirects
# (Stripe calls it from the customer's browser, so localhost is fine only in dev).
PUBLIC_API_ORIGIN = os.environ.get('PUBLIC_API_ORIGIN', 'http://localhost:8000').rstrip('/')

# Deep-link scheme of the Expo app (app.json "scheme"). Return URLs that start
# with "<APP_SCHEME>://" are allowed, so native checkouts come back into the app.
APP_SCHEME = os.environ.get('APP_SCHEME', 'agentai').strip()

# --- Static files ---------------------------------------------------------
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
