"""
App configuration for the `conditions` application.

Defines metadata for Django to recognize and manage the conditions app, 
including default primary key behavior and module path.
"""

# ================================
# Django Imports
# ================================
from django.apps import AppConfig  # Base class for configuring Django applications


# ==================================
# Conditions App Configuration
# ==================================
class ConditionsConfig(AppConfig):
    """Configuration class for the Conditions app."""
    default_auto_field = 'django.db.models.BigAutoField'  # Use BigAutoField for model primary keys by default
    name = 'conditions'  # Name used by Django to refer to this app internally
