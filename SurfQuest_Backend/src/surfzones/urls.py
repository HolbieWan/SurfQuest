"""
URL configuration for the `surfzones` app.

This sets up routes for surf zones and surf spots using Django REST Framework ViewSets.
"""

# ============================
# Django Imports
# ============================
from django.conf import settings   # Import Django project settings (e.g., MEDIA_URL, MEDIA_ROOT)
from django.urls import path, include   # Import path and include for URL routing
from django.conf.urls.static import static    # Used to serve media files during development

# ============================
# Third-Party Imports
# ============================
from rest_framework.routers import DefaultRouter   # Import DRF's router to automatically generate API routes for ViewSets

# ============================
# Local Application Imports
# ============================
from .views import surfZoneViewSet, surfSpotViewSet   # Import ViewSets for surf zones and surf spots


# ============================
# DRF Router Setup
# ============================
router = DefaultRouter()   # Create a default DRF router instance
router.register(r'surfzones', surfZoneViewSet)   # Register the surf zone endpoints (e.g., /surfzones/, /surfzones/<id>/)
router.register(r'surfspots', surfSpotViewSet)   # Register the surf spot endpoints (e.g., /surfspots/, /surfspots/<id>/)

# ============================
# URL Patterns
# ============================
urlpatterns = [
    path('', include(router.urls)),  # Include all ViewSet-generated routes
]

# ============================
# Media File Serving (Only in Development)
# ============================
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)   # Allow serving uploaded media files via Django in development
