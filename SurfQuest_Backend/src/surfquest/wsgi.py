"""
WSGI configuration for the `surfquest` project.

This sets up the WSGI application used by Django's development server and compatible production servers.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information, see:
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os   # Provides functions to interact with the operating system
from django.core.wsgi import get_wsgi_application   # Imports the function to get the WSGI application

# ============================
# Environment-Specific Settings
# ============================

# Get the current environment name from the 'DJANGO_ENV' environment variable
# Default to 'dev' if not explicitly set (e.g., 'production', 'staging', etc.)
environment = os.getenv('DJANGO_ENV', 'dev')

# Set the Django settings module based on the environment
# Example: 'surfquest.settings.dev' or 'surfquest.settings.production'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'surfquest.settings.{environment}')

# ============================
# WSGI Application
# ============================

# Create the WSGI application object for the server to use
application = get_wsgi_application()