"""
ViewSet for the conditions app.

This module exposes surf condition data (e.g., water temp, swell size) for each month
via a read-only API endpoint using Django REST Framework.
"""

# ============================
# Django REST Framework Imports
# ============================
from rest_framework import viewsets  # Base class for building ViewSets

# ============================
# Local Application Imports
# ============================
from .models import Condition
from .serializers import ConditionSerializer


# ============================
# ViewSets
# ============================
class ConditionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Condition model.

    Provides read-only access to all surf condition records.
    Only GET requests are allowed.
    """
    queryset = Condition.objects.all()
    serializer_class = ConditionSerializer
    http_method_names = ['get']   # Restrict to read-only access
