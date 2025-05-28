"""
ASGI config for surfquest project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

# Set the default Django settings module for ASGI applications.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'surfquest.settings')

# Get the default ASGI application callable.
application = get_asgi_application()
