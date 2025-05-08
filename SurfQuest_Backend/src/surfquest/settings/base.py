"""
Base Django settings for the SurfQuest project.

This configuration is inherited by `dev.py` and `prod.py`,
containing shared settings across all environments.
"""

# ============================
# Imports
# ============================

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# ============================
# Environment Variables & Base Directory
# ============================

# Load environment variables from .env file
load_dotenv()

# Define the base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# ============================
# Security Configuration
# ============================

# Secret key for cryptographic signing
SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")

# Toggle debug mode (should be False in production)
DEBUG = os.getenv("DEBUG", "False") == "True"

# Allowed hosts for the application
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "backend", "nginx"]

# Enable HTTPS detection behind a proxy like Nginx
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ============================
# Application Definition
# ============================

# Core and third-party applications
INSTALLED_APPS = [
    'django.contrib.admin',                   # Admin site
    'django.contrib.auth',                    # Authentication system
    'django.contrib.contenttypes',            # Content type framework
    'django.contrib.sessions',                # Session framework
    'django.contrib.messages',                # Messaging framework
    'django.contrib.staticfiles',             # Static files (CSS, JavaScript, Images)
    
    # Third-party applications
    'rest_framework',                         # Django REST framework
    'rest_framework_simplejwt',               # JWT authentication for DRF
    'corsheaders',                            # Cross-Origin Resource Sharing

    # Local applications
    'users',                                  # User management
    'surfzones',                              # Surf zones management
    'conditions',                             # Conditions management
]

# ============================
# REST Framework Configuration
# ============================

# Define default authentication methods
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# ============================
# JWT Configuration
# ============================

# JSON Web Token settings for secure authentication
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),            # Access token lifespan
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),            # Refresh token lifespan
    'ROTATE_REFRESH_TOKENS': False,                         # Do not rotate refresh tokens
    'BLACKLIST_AFTER_ROTATION': True,                       # Blacklist tokens after refresh
    'ALGORITHM': 'HS256',                                   # Signing algorithm
    'SIGNING_KEY': SECRET_KEY,                              # Secret key for signing
    'AUTH_HEADER_TYPES': ('Bearer',),                       # Expected header type
    'USER_ID_FIELD': 'id',                                  # User ID field
    'USER_ID_CLAIM': 'user_id',                             # Claim to store user ID
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# ============================
# Middleware Configuration
# ============================

# Middleware stack for processing requests
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',               # CORS headers support
    'django.middleware.common.CommonMiddleware',           # Common HTTP headers
    'django.middleware.security.SecurityMiddleware',       # Security enhancements
    'django.contrib.sessions.middleware.SessionMiddleware', # Session support
    'django.middleware.csrf.CsrfViewMiddleware',           # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware', # User authentication
    'django.contrib.messages.middleware.MessageMiddleware', # Messaging support
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # Clickjacking protection
]

# ============================
# CORS & Security Settings
# ============================

# Allow credentials (cookies, authorization headers) to be included in requests
CORS_ALLOW_CREDENTIALS = True

# Ensure cookies are only accessible via HTTP(S) and not JavaScript
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

# Enforce secure cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# ============================
# URL Configuration
# ============================

# Root URL configuration module
ROOT_URLCONF = 'surfquest.urls'

# ============================
# Static and Media Files
# ============================

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

# Media files (user-uploaded content)
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# ============================
# Templates Configuration
# ============================

# Template engine configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],      # Optional custom template directories
        'APP_DIRS': True, # Look for templates inside apps
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

# ============================
# Application Server Configuration
# ============================

# WSGI application entry point for Gunicorn
WSGI_APPLICATION = 'surfquest.wsgi.application'

# ============================
# Authentication Configuration
# ============================

# Custom user model
AUTH_USER_MODEL = 'users.User'

# Password validation rules
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ============================
# Internationalization Settings
# ============================

LANGUAGE_CODE = 'en-us'    # Default language
TIME_ZONE = 'UTC'          # Default timezone
USE_I18N = True             # Enable internationalization
USE_TZ = True               # Enable timezone support

# ============================
# Miscellaneous Settings
# ============================

# Primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Maximum number of fields Django can process in a form submission
DATA_UPLOAD_MAX_NUMBER_FIELDS = 5000