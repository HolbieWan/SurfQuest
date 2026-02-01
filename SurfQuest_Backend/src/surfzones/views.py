"""
ViewSets for the surfzones app.

This module defines Django REST Framework viewsets to expose surf zone
and surf spot data through authenticated, read-only API endpoints.

We keep the legacy ViewSets (surfzones, surfspots) for backward compatibility.
We add new v2 endpoints:
- surfzones-lite/
- surfzones-detail/<uuid:id>/
- surfspots-lite/
- surfspots-detail/<uuid:id>/
"""

# ============================
# Django REST Framework Imports
# ============================
from django.db.models import Prefetch   # For optimizing related object queries
from rest_framework import viewsets   # Base class for building ViewSets
from rest_framework.generics import ListAPIView, RetrieveAPIView   # Generic views for list and detail endpoints
from rest_framework.permissions import IsAuthenticated, AllowAny   # Restrict access to authenticated users only

# ============================
# Local Application Imports
# ============================
from .models import SurfZone, SurfSpot, SurfZoneImage, SurfSpotImage   # Surf-related models
from .serializers import SurfZoneSerializer, SurfSpotSerializer, SurfZoneLiteSerializer, SurfSpotLiteSerializer, SurfZoneDetailSerializer, SurfSpotDetailSerializer   # Corresponding serializers


class surfZoneViewSet(viewsets.ModelViewSet):
    """
    ViewSet for SurfZone model.

    Provides read-only access to all surf zones.
    Only GET requests are allowed.
    Authentication is required.
    """
    queryset = SurfZone.objects.all()
    serializer_class = SurfZoneSerializer
    permission_classes = [AllowAny]
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
    permission_classes = [AllowAny]
    http_method_names = ['get']   # Restrict to GET requests only


# ============================
# V2 endpoints (optimized)
# ============================

class SurfZoneLiteListAPIView(ListAPIView):
    """
    List SurfZones with lightweight payload + backend filtering.

    Filters supported (query params):
    - country_id (UUID) OR country_code (e.g. "FRA") OR country_slug
    - traveler_type (e.g. "Couple")  -> ArrayField contains
    - safety
    - confort
    - cost
    - main_wave_direction

    Month-based filters (apply on related Condition rows):
    - month (e.g. "July")  (recommended: always send this if using any condition filter)
    - surf_level (e.g. "Beginner")  -> ArrayField contains
    - sunny_days_min / sunny_days_max
    - rain_days_min / rain_days_max
    - water_temp_c_min / water_temp_c_max
    - surf_rating_min (uses world_surf_rating by default)
    - swell_size_meter_min / swell_size_meter_max
    - crowd (e.g. "Low")
    """
    permission_classes = [AllowAny]
    http_method_names = ["get"]
    serializer_class = SurfZoneLiteSerializer

    def get_queryset(self):
        # ✅ Prefetch optimized: only columns needed + stable ordering
        zone_images_qs = (
            SurfZoneImage.objects
            .only("id", "image", "description", "created_at", "surfzone_id")
            .order_by("created_at")
        )

        qs = (
            SurfZone.objects
            .select_related("country")
            .prefetch_related(
                Prefetch("zone_images", queryset=zone_images_qs),
            )
        )

        p = self.request.query_params

        # ----------------------------
        # SurfZone-level filters
        # ----------------------------
        country_id = p.get("country_id")
        if country_id:
            qs = qs.filter(country_id=country_id)

        country_code = p.get("country_code")
        if country_code:
            qs = qs.filter(country__code=country_code)

        country_slug = p.get("country_slug")
        if country_slug:
            qs = qs.filter(country__slug=country_slug)

        traveler_type = p.get("traveler_type")
        if traveler_type:
            qs = qs.filter(traveler_type__contains=[traveler_type])

        safety = p.get("safety")
        if safety:
            qs = qs.filter(safety=safety)

        confort = p.get("confort")
        if confort:
            qs = qs.filter(confort=confort)

        cost = p.get("cost")
        if cost:
            qs = qs.filter(cost=cost)

        main_wave_direction = p.get("main_wave_direction")
        if main_wave_direction:
            qs = qs.filter(main_wave_direction=main_wave_direction)

        # ----------------------------
        # Condition (month-based) filters
        # ----------------------------
        month = p.get("month")
        condition_filter_used = any(
            k in p for k in (
                "surf_level",
                "sunny_days_min", "sunny_days_max",
                "rain_days_min", "rain_days_max",
                "water_temp_c_min", "water_temp_c_max",
                "surf_rating_min",
                "swell_size_meter_min", "swell_size_meter_max",
                "crowd",
            )
        )

        if month or condition_filter_used:
            if month:
                qs = qs.filter(conditions__month=month)

            surf_level = p.get("surf_level")
            if surf_level:
                qs = qs.filter(conditions__surf_level__contains=[surf_level])

            sunny_min = p.get("sunny_days_min")
            if sunny_min is not None:
                qs = qs.filter(conditions__sunny_days__gte=int(sunny_min))

            sunny_max = p.get("sunny_days_max")
            if sunny_max is not None:
                qs = qs.filter(conditions__sunny_days__lte=int(sunny_max))

            rain_min = p.get("rain_days_min")
            if rain_min is not None:
                qs = qs.filter(conditions__rain_days__gte=int(rain_min))

            rain_max = p.get("rain_days_max")
            if rain_max is not None:
                qs = qs.filter(conditions__rain_days__lte=int(rain_max))

            water_min = p.get("water_temp_c_min")
            if water_min is not None:
                qs = qs.filter(conditions__water_temp_c__gte=int(water_min))

            water_max = p.get("water_temp_c_max")
            if water_max is not None:
                qs = qs.filter(conditions__water_temp_c__lte=int(water_max))

            surf_rating_min = p.get("surf_rating_min")
            if surf_rating_min is not None:
                qs = qs.filter(conditions__world_surf_rating__gte=int(surf_rating_min))

            swell_min = p.get("swell_size_meter_min")
            if swell_min is not None:
                qs = qs.filter(conditions__swell_size_meter__gte=float(swell_min))

            swell_max = p.get("swell_size_meter_max")
            if swell_max is not None:
                qs = qs.filter(conditions__swell_size_meter__lte=float(swell_max))

            crowd = p.get("crowd")
            if crowd:
                qs = qs.filter(conditions__crowd=crowd)

            qs = qs.distinct()

        return qs


class SurfZoneDetailAPIView(RetrieveAPIView):
    """
    Retrieve detailed info for a single SurfZone by ID.
    Includes related country, images, conditions, and surf spots + their images.
    """
    permission_classes = [AllowAny]
    http_method_names = ["get"]
    serializer_class = SurfZoneDetailSerializer
    lookup_field = "id"

    def get_queryset(self):
        # ✅ Prefetch optimized: only columns needed + stable ordering
        zone_images_qs = (
            SurfZoneImage.objects
            .only("id", "image", "description", "created_at", "surfzone_id")
            .order_by("created_at")
        )

        spot_images_qs = (
            SurfSpotImage.objects
            .only("id", "image", "description", "created_at", "surfspot_id")
            .order_by("created_at")
        )

        surf_spots_qs = (
            SurfSpot.objects
            .only(
                "id", "name", "slug", "latitude", "longitude",
                "break_type", "wave_direction",
                "best_wind_direction", "best_swell_direction",
                "best_swell_size_feet", "best_swell_size_meter",
                "description",
                # plus any fields your serializer reads directly from SurfSpot
            )
            .order_by("name")
            .prefetch_related(
                Prefetch("spot_images", queryset=spot_images_qs),
            )
        )

        return (
            SurfZone.objects
            .select_related("country")
            .prefetch_related(
                Prefetch("zone_images", queryset=zone_images_qs),
                "conditions",
                Prefetch("surf_spots", queryset=surf_spots_qs),
            )
            .all()
        )


class SurfSpotLiteListAPIView(ListAPIView):
    """
    List SurfSpots with lightweight payload + backend filtering.
    """
    permission_classes = [AllowAny]
    serializer_class = SurfSpotLiteSerializer
    http_method_names = ["get"]

    def get_queryset(self):
        # ✅ Prefetch optimized: only columns needed + stable ordering
        spot_images_qs = (
            SurfSpotImage.objects
            .only("id", "image", "description", "created_at", "surfspot_id")
            .order_by("created_at")
        )

        qs = (
            SurfSpot.objects
            .select_related("surfzone", "surfzone__country")
            .prefetch_related(
                Prefetch("spot_images", queryset=spot_images_qs),
            )
        )

        p = self.request.query_params

        surfzone_id = p.get("surfzone_id")
        if surfzone_id:
            qs = qs.filter(surfzone_id=surfzone_id)

        surfzone_slug = p.get("surfzone_slug")
        if surfzone_slug:
            qs = qs.filter(surfzone__slug=surfzone_slug)

        best_month = p.get("best_month")
        if best_month:
            qs = qs.filter(best_months__contains=[best_month])

        surf_level = p.get("surf_level")
        if surf_level:
            qs = qs.filter(surf_level__contains=[surf_level])

        best_tide = p.get("best_tide")
        if best_tide:
            qs = qs.filter(best_tide__contains=[best_tide])

        break_type = p.get("break_type")
        if break_type:
            qs = qs.filter(break_type=break_type)

        wave_direction = p.get("wave_direction")
        if wave_direction:
            qs = qs.filter(wave_direction=wave_direction)

        best_wind_direction = p.get("best_wind_direction")
        if best_wind_direction:
            qs = qs.filter(best_wind_direction=best_wind_direction)

        best_swell_direction = p.get("best_swell_direction")
        if best_swell_direction:
            qs = qs.filter(best_swell_direction=best_swell_direction)

        swell_min = p.get("best_swell_size_meter_min")
        if swell_min is not None:
            qs = qs.filter(best_swell_size_meter__gte=float(swell_min))

        swell_max = p.get("best_swell_size_meter_max")
        if swell_max is not None:
            qs = qs.filter(best_swell_size_meter__lte=float(swell_max))

        return qs.order_by("name")


class SurfSpotDetailAPIView(RetrieveAPIView):
    """
    Retrieve detailed info for a single SurfSpot by ID.
    Includes related surfzone, images.
    """
    permission_classes = [AllowAny]
    http_method_names = ["get"]
    serializer_class = SurfSpotDetailSerializer
    lookup_field = "id"

    def get_queryset(self):
        # ✅ Prefetch optimized: only columns needed + stable ordering
        spot_images_qs = (
            SurfSpotImage.objects
            .only("id", "image", "description", "created_at", "surfspot_id")
            .order_by("created_at")
        )

        return (
            SurfSpot.objects
            .select_related("surfzone")
            .prefetch_related(
                Prefetch("spot_images", queryset=spot_images_qs),
            )
            .all()
        )
