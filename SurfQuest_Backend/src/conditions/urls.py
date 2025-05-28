"""
URL configuration for the `conditions` app.

This sets up API routes for surf condition data using Django REST Framework ViewSets.
"""

# ============================
# Django Imports
# ============================
from django.urls import path, include   # Import functions to define URL patterns in Django

# ============================
# Third-Party Imports
# ============================
from rest_framework.routers import DefaultRouter   # Import DRF's router to automatically generate API routes for ViewSets

# ============================
# Local Imports
# ============================
from .views import ConditionViewSet   # Import the ViewSet that manages surf conditions


# ============================
# DRF Router Setup
# ============================
router = DefaultRouter()   # Create a default DRF router instance
router.register(r'conditions', ConditionViewSet)   # Register condition endpoints (e.g., /conditions/, /conditions/<id>/)

# ============================
# URL Patterns
# ============================
urlpatterns = [
    path('', include(router.urls)),   # Include all ViewSet-generated routes
]