"""
Serializers for the surfzones app.

This module defines how model instances are converted to and from JSON representations
for the SurfQuest API. It includes serializers for geographical and surf-related models
such as Continent, Country, SurfZone, and SurfSpot, including their associated images.
"""

# ============================
# Django REST Framework Import
# ============================
from rest_framework import serializers  # Django REST Framework base serializers
# ============================
# Local Application Imports
# ============================
from .models import (
    Continent,
    Country,
    SurfZone,
    SurfSpot,
    SurfZoneImage,
    SurfSpotImage,
)

# ============================
# External App Serializers
# ============================
from conditions.serializers import ConditionSerializer


# ============================
# Serializers:
# ============================
class ContinentSerializer(serializers.ModelSerializer):
    """Serializer for Continent model."""
    class Meta:
        model = Continent
        fields = '__all__'

class CountrySerializer(serializers.ModelSerializer):
    """Serializer for Country model."""
    class Meta:
        model = Country
        fields = '__all__'

class SurfZoneImageSerializer(serializers.ModelSerializer):
    """Serializer for images associated with a SurfZone."""
    class Meta:
        model = SurfZoneImage
        fields = '__all__'

class SurfZoneSerializer(serializers.ModelSerializer):
    """
    Serializer for SurfZone model.

    Includes nested country data, related images, and surf conditions.
    """
    country = CountrySerializer(read_only=True)
    zone_images = SurfZoneImageSerializer(many=True, read_only=True)
    conditions = ConditionSerializer(many=True, read_only=True)
    class Meta:
        model = SurfZone
        fields = '__all__'

class SurfSpotImageSerializer(serializers.ModelSerializer):
    """Serializer for images associated with a SurfSpot."""
    class Meta:
        model = SurfSpotImage
        fields = '__all__'

class SurfSpotSerializer(serializers.ModelSerializer):
    """
    Serializer for SurfSpot model.

    Includes nested surfzone and related images.
    """
    surfzone = SurfZoneSerializer(read_only=True)
    spot_images = SurfSpotImageSerializer(many=True, read_only=True)
    class Meta:
        model = SurfSpot
        fields = '__all__'
