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
# V2 / Optimized serializers
# ===============================================================================================================================================================
class CountryLiteSerializer(serializers.ModelSerializer):
    """Small country payload for list/detail screens."""
    class Meta:
        model = Country
        fields = ("id", "name", "code", "slug")


class SurfZoneImageLiteSerializer(serializers.ModelSerializer):
    """Light SurfZone image payload (only what the frontend usually needs)."""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = SurfZoneImage
        fields = ("id", "image_url", "description")

    def get_image_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class SurfSpotImageLiteSerializer(serializers.ModelSerializer):
    """Light SurfSpot image payload."""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = SurfSpotImage
        fields = ("id", "image_url", "description")

    def get_image_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class SurfZoneLiteSerializer(serializers.ModelSerializer):
    """
    SurfZone list serializer (lite).
    - No full images list
    - No conditions
    - Provides a single main image URL for cards
    """
    country = CountryLiteSerializer(read_only=True)
    main_image_url = serializers.SerializerMethodField()

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
            "main_image_url",
        )

    def get_main_image_url(self, obj):
        """Method to get the main image URL for the surf zone, using cash from prefetched data if available."""
        request = self.context.get("request")

        # 1) Use prefetched cache if available (no DB query)
        cache = getattr(obj, "_prefetched_objects_cache", {})
        if "zone_images" in cache:
            images = cache["zone_images"]
            first = images[0] if images else None
        else:
            # 2) fallback: single DB query
            first = obj.zone_images.all().order_by("created_at").first()

        if not first or not first.image:
            return None

        url = first.image.url
        return request.build_absolute_uri(url) if request else url


class SurfSpotLiteSerializer(serializers.ModelSerializer):
    """
    Surfspot serializer embedded in SurfZone detail with all surfspot images (light).
    """
    surfzone_name = serializers.CharField(source="surfzone.name", read_only=True)
    surfzone_slug = serializers.CharField(source="surfzone.slug", read_only=True)
    main_image_url = serializers.SerializerMethodField()

    class Meta:
        model = SurfSpot
        fields = (
            "id",
            "name",
            "slug",
            "surfzone",        # FK -> id seulement
            "surfzone_name",   # ajouté (pratique pour l'UI)
            "surfzone_slug",   # ajouté (pratique pour routing)
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
            "main_image_url",
        )
    
    def get_main_image_url(self, obj):
        """Method to get the main image URL for the surf spot, using cash from prefetched data if available."""
        request = self.context.get("request")

        # 1) If prefetched, use the cached list (no DB query)
        cache = getattr(obj, "_prefetched_objects_cache", {})
        if "spot_images" in cache:
            images = cache["spot_images"]
            first = images[0] if images else None
        else:
            # 2) fallback: single DB query for this spot
            first = obj.spot_images.all().order_by("created_at").first()

        if not first or not first.image:
            return None

        url = first.image.url
        return request.build_absolute_uri(url) if request else url


class SurfSpotForZoneDetailSerializer(serializers.ModelSerializer):
    """Complete SurfSpot serializer embedded in SurfZone detail with 5 surfspot images (light)."""
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
            "images",  # 5 images max for carousel
        )

    def get_images(self, obj):
        """Method to get up to 5 image URLs for the surf spot."""
        request = self.context.get("request")
        imgs = obj.spot_images.all()[:5]  # 5 max
        return [
            request.build_absolute_uri(img.image.url) if request else img.image.url
            for img in imgs
            if img.image
        ]


class SurfZoneDetailSerializer(serializers.ModelSerializer):
    """
    SurfZone detail serializer (full).
    - Includes images + conditions + surf spots (lite)
    """
    country = CountryLiteSerializer(read_only=True)
    zone_images = serializers.SerializerMethodField()
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
            "zone_images",    # 2 premieres images
            "conditions",     # toutes les conditions
            "surf_spots",     # tous les surf spots (lite)
        )
    
    def get_zone_images(self, obj):
        """Method to get up to 2 image URLs for the surf zone."""
        request = self.context.get("request")
        images = obj.zone_images.all()[:2]  # Limit to first 2 images
        return [
            request.build_absolute_uri(img.image.url) if request else img.image.url
            for img in images
            if img.image
        ]


class SurfSpotDetailSerializer(serializers.ModelSerializer):
    """
    SurfSpot detail serializer (full):
    - surfzone light
    - spot images (light)
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
            "surfzone",        # FK id (pratique)
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
            "images",          # toutes les images
        )
    
    def get_images(self, obj):
        """Method to get all image URLs for the surf spot."""
        request = self.context.get("request")
        imgs = obj.spot_images.all()  # toutes les images
        return [
            request.build_absolute_uri(img.image.url) if request else img.image.url
            for img in imgs
            if img.image
        ]
