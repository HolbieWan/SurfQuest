"""
App configuration for the Surfzones app in the SurfQuest project.

This defines the application-specific settings used by Django to initialize the app.
"""

# ============================
# Django Imports
# ============================
from django.apps import AppConfig


# ============================
# Surfzones App Configuration
# ============================
class SurfzonesConfig(AppConfig):
    """Configuration class for the surfzones app."""
    default_auto_field = 'django.db.models.BigAutoField'  # Default field type for auto-created primary keys
    name = 'surfzones'  # Name of the app used in INSTALLED_APPS and Django registry
