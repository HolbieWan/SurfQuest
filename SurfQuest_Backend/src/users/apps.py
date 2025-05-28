"""
App configuration for the Users app in the SurfQuest project.

Defines settings for initializing and registering the custom user application.
"""

# ============================
# Django Imports
# ============================
from django.apps import AppConfig


# ============================
# Users App Configuration
# ============================
class UsersConfig(AppConfig):
    """Configuration class for the users app."""
    default_auto_field = 'django.db.models.BigAutoField'  # Default auto-generated primary key type
    name = 'users'  # Name used to reference this app throughout the Django project
