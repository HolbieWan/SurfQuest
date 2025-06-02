"""
Production Django settings for the SurfQuest project.

This configuration extends `base.py` with production-specific settings,
optimized for deployment, performance, and security.
"""

# ============================
# Import Base Settings
# ============================

from .base import *
import os

# ============================
# Production Environment Settings
# ============================

# Disable debugging mode for production
# DEBUG = False
DEBUG = True

# Define allowed hosts for production environment
ALLOWED_HOSTS = [
    'yourdomain.com',      # Replace with your domain
    'localhost',           # Localhost for local testing
    '127.0.0.1',           # Loopback IP address
    'backend',             # Docker service name for backend
    'nextjs_app',          # Docker service name for Next.js frontend
    'db',                  # Docker service name for PostgreSQL
    'django_app',          # Docker service name for Django
    'nginx',               # Docker service name for Nginx
    'nginx_server',        # Docker service name for Nginx server
    'surfquest-backend.onrender.com',
    'www.surfquest-trip-planner.com',
    'surfquest-trip-planner.com',     
    # '0.0.0.0',             # Allow all IP addresses (not recommended for production)
    # '*'                    # Allow all hosts (not recommended for production)
]

# ============================
# CSRF and CORS Configurations
# ============================

# Define trusted origins for CSRF protection
CSRF_TRUSTED_ORIGINS = [
    "https://yourdomain.com",         # Secure HTTPS access
    "http://yourdomain.com",          # Standard HTTP access
    "http://localhost",               # Local development
    "http://127.0.0.1",               # Loopback address
    "http://backend:8000",            # Docker backend service
    "http://nginx",                   # Docker nginx service
    "http://nextjs_app:3000",         # Docker frontend service
    "http://localhost:3000",          # Local development for frontend
    "http://django_app",
    "http://0.0.0.0",
    "http://<your_server_ip>"
]

# Allowed origins for Cross-Origin Resource Sharing (CORS)
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",         # Secure HTTPS access
    "http://yourdomain.com",          # Standard HTTP access
    "http://localhost",               # Local development
    "http://127.0.0.1",               # Loopback address
    "http://backend:8000",            # Docker backend service
    "http://nginx",                   # Docker nginx service
    "http://nextjs_app:3000",         # Docker frontend service
    "http://localhost:3000",          # Local development for frontend
    "http://django_app",
]

# ============================
# Database Configuration
# ============================

# PostgreSQL database configuration for production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',             # PostgreSQL as database engine
        'NAME': os.getenv('DATABASE_NAME', 'surfquest-db'),    # Database name
        'USER': os.getenv('DATABASE_USER', 'Admin44'),         # Database user
        'PASSWORD': os.getenv('DATABASE_PASSWORD', 'Admin44'), # Database password
        'HOST': os.getenv('DATABASE_HOST', 'db'),              # Docker service name for PostgreSQL
        'PORT': os.getenv('DATABASE_PORT', '5432'),            # Default PostgreSQL port
    }
}

# ============================
# Static and Media Files Configuration
# ============================

# Static files (CSS, JavaScript, Images)
STATICFILES_DIRS = []
STATIC_URL = '/static/'                 # URL to access static files
# STATIC_ROOT = '/app/staticfiles'             # Path inside the Docker container for static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') # For render deployment

# Media files (User uploads)
MEDIA_URL = '/media/'                   # URL to access media files
MEDIA_ROOT = '/app/media'               # Path inside the Docker container for media files

# ============================
# Security Headers Configuration
# ============================

# Enable XSS (Cross-site Scripting) protection
SECURE_BROWSER_XSS_FILTER = True

# Prevent browsers from detecting content types automatically
SECURE_CONTENT_TYPE_NOSNIFF = True

# Enforce HTTPS with a one-year validity period
SECURE_HSTS_SECONDS = 31536000          # 1 year in seconds
SECURE_HSTS_INCLUDE_SUBDOMAINS = True   # Apply to all subdomains
SECURE_HSTS_PRELOAD = True              # Preload into browsers

# Redirect all HTTP traffic to HTTPS if specified in the environment
SECURE_SSL_REDIRECT = os.getenv('SECURE_SSL_REDIRECT', 'False') == 'True'

# Use secure cookies
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Prevent the application from being loaded in an iframe
X_FRAME_OPTIONS = 'DENY'

# ============================
# Logging Configuration
# ============================

# Configure error logging to a file for easier monitoring and debugging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        # 'file': {
        #     'level': 'ERROR',                      
        #     'class': 'logging.FileHandler',
        #     'filename': os.path.join(BASE_DIR, 'logs', 'django_errors.log'),  
        # },
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',                      # Only log errors
            'propagate': True,                     # Propagate logs to parent loggers
        },
    },
}