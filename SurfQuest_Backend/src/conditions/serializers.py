"""
Serializers for the conditions app.

This module defines how Condition model instances are converted to and from JSON
for use in the SurfQuest API. Conditions represent monthly surf data linked to surf zones.
"""

# ============================
# Django REST Framework Import
# ============================
from rest_framework import serializers  # DRF serializer base class

# ============================
# Local Application Imports
# ============================
from .models import Condition


# ============================
# Serializers:
# ============================
class ConditionSerializer(serializers.ModelSerializer):
    """
    Serializer for Condition model.

    Used to expose monthly surf conditions (e.g. water temp, wind, swell)
    linked to a surf zone.
    """
    class Meta:
        model = Condition
        fields = '__all__'  # Serialize all fields from the model