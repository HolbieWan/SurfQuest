"""
Development Django settings for the SurfQuest project.

This configuration extends `base.py` with development-specific settings,
optimized for local development and debugging.
"""

# ============================
# Import Base Settings
# ============================

import os
from .base import *

# ============================
# Debugging & Host Settings
# ============================

# Enable Django's debugging mode for better error messages during development.
DEBUG = True

# Allowed hosts for local development.
ALLOWED_HOSTS = [
    'localhost',          # Localhost for standard testing
    '127.0.0.1',          # Loopback IP address
    'backend',            # Docker service name for backend
    'nginx'               # Nginx reverse proxy service
]

# ============================
# Media Configuration
# ============================

# Public URL of the media folder for serving uploaded files
MEDIA_URL = 'http://localhost:8080/media/'
# Local path to the media folder inside the Docker container
MEDIA_ROOT = '/app/media/'

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'                 # URL to access static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')             # Path inside the Docker container for static files

# ============================
# CORS (Cross-Origin Resource Sharing) Configuration
# ============================

# Define origins allowed to access the API
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",       # Local frontend on default React port
    "http://127.0.0.1:3000",       # Loopback address for frontend
    "http://backend:8000",         # Docker backend service
    "http://frontend:3000",        # Docker frontend service
]

# Trusted origins for CSRF protection
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://frontend:3000",
    "http://backend:8000",
]

# HTTP Methods allowed from cross-origin requests
CORS_ALLOW_METHODS = [
    "GET",           # Allow fetching data
    "POST",          # Allow creating new records
    "PUT",           # Allow updating records
    "PATCH",         # Allow partial updates
    "DELETE",        # Allow deletions
    "OPTIONS",       # Preflight request for complex HTTP requests
]

# Allowed headers in CORS requests
CORS_ALLOW_HEADERS = [
    "content-type",          # Content-Type header
    "authorization",         # Authorization header for JWT tokens
    "Content-Type",          # Explicit content type
    "Authorization",         # Explicit authorization header
    "x-csrf-token",          # CSRF token header for CSRF protection
    "x-requested-with",      # XMLHttpRequest support
]

# ============================
# Database Configuration
# ============================

# PostgreSQL database configuration for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',          # Use PostgreSQL as database engine
        'NAME': os.getenv('DATABASE_NAME', ''),             # Database name
        'USER': os.getenv('DATABASE_USER', ''),             # Database user
        'PASSWORD': os.getenv('DATABASE_PASSWORD', ''),     # Database password
        'HOST': os.getenv('DATABASE_HOST', 'db'),           # Database host
        'PORT': os.getenv('DATABASE_PORT', '5432'),         # Database port
    }
}