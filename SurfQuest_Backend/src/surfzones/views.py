"""
ViewSets for the surfzones app.

This module defines Django REST Framework viewsets to expose surf zone
and surf spot data through authenticated, read-only API endpoints.
"""

# ============================
# Django REST Framework Imports
# ============================
from rest_framework import viewsets   # Base class for building ViewSets
from rest_framework.permissions import IsAuthenticated   # Restrict access to authenticated users only

# ============================
# Local Application Imports
# ============================
from .models import SurfZone, SurfSpot   # Surf-related models
from .serializers import SurfZoneSerializer, SurfSpotSerializer   # Corresponding serializers


class surfZoneViewSet((viewsets.ModelViewSet)):
    """
    ViewSet for SurfZone model.

    Provides read-only access to all surf zones.
    Only GET requests are allowed.
    Authentication is required.
    """
    queryset = SurfZone.objects.all()
    serializer_class = SurfZoneSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']   # Restrict to GET requests only


class surfSpotViewSet(viewsets.ModelViewSet):
    """
    ViewSet for SurfSpot model.

    Provides read-only access to all surf spots.
    Only GET requests are allowed.
    Authentication is required.
    """
    queryset = SurfSpot.objects.all()
    serializer_class = SurfSpotSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']   # Restrict to GET requests only
