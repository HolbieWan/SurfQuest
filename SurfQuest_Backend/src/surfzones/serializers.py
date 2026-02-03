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


# ===============================================================================================================================================================
# # V2 / Optimized serializers
# ================================================================================================================================================================

# ======================================================================
# Country
# ======================================================================
class CountryLiteSerializer(serializers.ModelSerializer):
    """Small country payload for list/detail screens."""

    class Meta:
        model = Country
        fields = ("id", "name", "code", "slug")


# ======================================================================
# Shared helper (images -> list[str])
# ======================================================================
def build_image_urls(queryset, request=None, limit=None):
    """
    Returns a list of image URLs.
    - limit: optional max number of images
    """
    if limit:
        queryset = queryset[:limit]

    urls = []
    for img in queryset:
        if img.image:
            url = img.image.url
            # urls.append(request.build_absolute_uri(url) if request else url)
            urls.append(url)  # /media/...
    return urls


# ======================================================================
# SurfZone - Lite Serializer (list/cards)
# ======================================================================
class SurfZoneLiteSerializer(serializers.ModelSerializer):
    """
    SurfZone list serializer (lite).
    - images: max 1 image (card usage)
    """
    country = CountryLiteSerializer(read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = SurfZone
        fields = (
            "id",
            "name",
            "slug",
            "country",
            "latitude",
            "longitude",
            "nearest_city",
            "nearest_airport",
            "traveler_type",
            "safety",
            "health_hazards",
            "surf_hazards",
            "best_months",
            "confort",
            "cost",
            "language",
            "currency",
            "religion",
            "surroundings",
            "description",
            "main_wave_direction",
            "images",
        )

    def get_images(self, obj):
        request = self.context.get("request")

        cache = getattr(obj, "_prefetched_objects_cache", {})
        if "zone_images" in cache:
            images_qs = cache["zone_images"]
        else:
            images_qs = obj.zone_images.all().order_by("created_at")

        return build_image_urls(images_qs, request=request, limit=1)


# ======================================================================
# SurfSpot - Lite Serializer (embedded or list)
# ======================================================================
class SurfSpotLiteSerializer(serializers.ModelSerializer):
    """
    SurfSpot lite serializer.
    - images: max 1 image
    - surfzone_name & slug for UI/routing
    """
    surfzone_name = serializers.CharField(source="surfzone.name", read_only=True)
    surfzone_slug = serializers.CharField(source="surfzone.slug", read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = SurfSpot
        fields = (
            "id",
            "name",
            "slug",
            "surfzone",
            "surfzone_name",
            "surfzone_slug",
            "latitude",
            "longitude",
            "break_type",
            "wave_direction",
            "best_wind_direction",
            "best_swell_direction",
            "best_swell_size_feet",
            "best_swell_size_meter",
            "best_tide",
            "surf_level",
            "surf_hazards",
            "best_months",
            "description",
            "images",
        )

    def get_images(self, obj):
        request = self.context.get("request")

        cache = getattr(obj, "_prefetched_objects_cache", {})
        if "spot_images" in cache:
            images_qs = cache["spot_images"]
        else:
            images_qs = obj.spot_images.all().order_by("created_at")

        return build_image_urls(images_qs, request=request, limit=1)


# ======================================================================
# SurfSpot - For SurfZone Detail (carousel)
# ======================================================================
class SurfSpotForZoneDetailSerializer(serializers.ModelSerializer):
    """
    SurfSpot serializer embedded in SurfZone detail.
    - images: max 5 images (carousel)
    """
    images = serializers.SerializerMethodField()

    class Meta:
        model = SurfSpot
        fields = (
            "id",
            "name",
            "slug",
            "latitude",
            "longitude",
            "break_type",
            "wave_direction",
            "best_wind_direction",
            "best_swell_direction",
            "best_swell_size_feet",
            "best_swell_size_meter",
            "best_tide",
            "surf_level",
            "surf_hazards",
            "best_months",
            "description",
            "images",
        )

    def get_images(self, obj):
        request = self.context.get("request")
        imgs = obj.spot_images.all().order_by("created_at")
        return build_image_urls(imgs, request=request, limit=5)


# ======================================================================
# SurfZone - Detail Serializer (full)
# ======================================================================
class SurfZoneDetailSerializer(serializers.ModelSerializer):
    """
    SurfZone detail serializer.
    - images: max 2 images
    - conditions
    - surf spots (lite with carousel images)
    """
    country = CountryLiteSerializer(read_only=True)
    images = serializers.SerializerMethodField()
    conditions = ConditionSerializer(many=True, read_only=True)
    surf_spots = SurfSpotForZoneDetailSerializer(many=True, read_only=True)

    class Meta:
        model = SurfZone
        fields = (
            "id",
            "name",
            "slug",
            "country",
            "latitude",
            "longitude",
            "nearest_city",
            "nearest_airport",
            "traveler_type",
            "safety",
            "health_hazards",
            "surf_hazards",
            "best_months",
            "confort",
            "cost",
            "language",
            "currency",
            "religion",
            "surroundings",
            "description",
            "main_wave_direction",
            "images",
            "conditions",
            "surf_spots",
        )

    def get_images(self, obj):
        request = self.context.get("request")
        imgs = obj.zone_images.all().order_by("created_at")
        return build_image_urls(imgs, request=request, limit=2)


# ======================================================================
# SurfSpot - Detail Serializer (full)
# ======================================================================
class SurfSpotDetailSerializer(serializers.ModelSerializer):
    """
    SurfSpot detail serializer.
    - images: all images
    - surfzone name + slug
    """
    surfzone_name = serializers.CharField(source="surfzone.name", read_only=True)
    surfzone_slug = serializers.CharField(source="surfzone.slug", read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = SurfSpot
        fields = (
            "id",
            "name",
            "slug",
            "surfzone",
            "surfzone_name",
            "surfzone_slug",
            "latitude",
            "longitude",
            "break_type",
            "wave_direction",
            "best_wind_direction",
            "best_swell_direction",
            "best_swell_size_feet",
            "best_swell_size_meter",
            "best_tide",
            "surf_level",
            "surf_hazards",
            "best_months",
            "description",
            "images",
        )

    def get_images(self, obj):
        request = self.context.get("request")
        imgs = obj.spot_images.all().order_by("created_at")
        return build_image_urls(imgs, request=request)