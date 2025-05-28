#!/usr/bin/env python
"""
Custom Django command-line utility for administrative tasks.

This script bootstraps the Django environment based on the DJANGO_ENV environment variable,
allowing dynamic switching between settings modules (e.g., dev, prod).
"""

# ============================
# Python Standard Library
# ============================
import os  # For environment variable access
import sys  # For accessing command-line arguments and modifying the path

# ============================
# Path Configuration
# ============================

# Add /app to the Python path (useful when running in a Docker container or custom structure)
sys.path.append('/app')


# ============================
# Main Execution Entry Point
# ============================

if __name__ == '__main__':
    # Dynamically set the Django settings module based on environment (default to 'dev')
    environment = os.getenv('DJANGO_ENV', 'dev')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'surfquest.settings.{environment}')

    # Debugging output for confirmation
    print("PYTHONPATH:", sys.path)
    print("DJANGO_SETTINGS_MODULE:", os.getenv('DJANGO_SETTINGS_MODULE'))

    try:
        # Attempt to import Django's CLI entry point
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Raise a helpful error if Django is not installed or virtualenv isn't activated
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Execute the command-line utility with provided arguments
    execute_from_command_line(sys.argv)