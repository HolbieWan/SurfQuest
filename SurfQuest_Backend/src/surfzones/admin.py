"""
Admin configuration for the SurfZones app in the SurfQuest project.

Registers Continent, Country, SurfZone, SurfSpot, SurfZoneImage, and SurfSpotImage models
with custom admin display, search, and editing features to enhance data management.
"""

# ============================
# Django Admin Utilities
# ============================
from django.contrib import admin

# ============================
# Local Application Models
# ============================
from .models import Country, Continent, SurfZone, SurfSpot, SurfSpotImage, SurfZoneImage

# ============================
# Admin: Continent
# ============================
@admin.register(Continent)
class ContinentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'code',
        'slug'
    )

    empty_value_display = 'unknown'   # Display when a field is empty

    list_editable = [
        'name',
        'code',
        'slug'
    ]

    search_fields = [
        'name',
    ]


# ============================
# Admin: Country
# ============================
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'code',
        'continent',
        'slug'
    )

    empty_value_display = 'unknown'   # Display when a field is empty

    list_editable = [
        'name',
        'code',
        'continent',
        'slug'
    ]

    search_fields = [
        'name',
    ]



# ============================
# Admin: SurfZone
# ============================
@admin.register(SurfZone)
class SurfZoneAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'country',
        'latitude',
        'longitude',
        'nearest_city',
        'nearest_airport',
        'airport_latitude',
        'airport_longitude',
        'traveler_type',
        'safety',
        'health_hazards',
        'surf_hazards',
        'best_months',
        'confort',
        'cost',
        'language',
        'currency',
        'religion',
        'surroundings',
        'description',
        'main_wave_direction',
        'slug'
    )

    empty_value_display = 'unknown'   # Display when a field is empty

    list_editable = [
        'name',
        'latitude',
        'longitude',
        'nearest_city',
        'nearest_airport',
        'airport_latitude',
        'airport_longitude',
        'traveler_type',
        'safety',
        'health_hazards',
        'surf_hazards',
        'best_months',
        'confort',
        'cost',
        'language',
        'currency',
        'religion',
        'surroundings',
        'description',
        'main_wave_direction'
    ]

    search_fields = [
        'name',
        'country__name',
    ]
    # autocomplete_fields = [
    #     'name',
    #     'country',
    # ]                              # Optional: Enables AJAX search


# ============================
# Admin: SurfSpot
# ============================
@admin.register(SurfSpot)
class SurfSpotAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'surfzone',
        'latitude',
        'longitude',
        'break_type',
        'wave_direction',
        'best_wind_direction',
        'best_swell_direction',
        'best_swell_size_feet',
        'best_swell_size_meter',
        'best_tide',
        'surf_level',
        'surf_hazards',
        'best_months',
        'description',
        'slug'
    )

    empty_value_display = 'unknown'   # Display when a field is empty

    list_editable = [
        'name',
        'latitude',
        'longitude',
        'break_type',
        'wave_direction',
        'best_wind_direction',
        'best_swell_direction',
        'best_swell_size_feet',
        'best_swell_size_meter',
        'best_tide',
        'surf_level',
        'surf_hazards',
        'best_months',
        'description'
    ]

    search_fields = [
        'name',
        'surfzone__name',
    ]

    # autocomplete_fields = [
    #     'name',
    #     'surfzone',
    # ]


# ============================
# Admin: SurfSpotImage
# ============================
@admin.register(SurfSpotImage)
class SurfSpotImageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'surfspot',
        'image',
        'description',
        'slug',
        'created_at'
    )

    empty_value_display = 'unknown'   # Display when a field is empty

    list_editable = [
        'image',
        'description',
        'slug'
    ]

    search_fields = [
        'surfspot__name',
    ]

    # autocomplete_fields = [
    #     'surfspot',
    # ]


# ============================
# Admin: SurfZoneImage
# ============================
@admin.register(SurfZoneImage)
class SurfZoneImageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'surfzone',
        'image',
        'description',
        'slug',
        'created_at'
    )

    empty_value_display = 'unknown'   # Display when a field is empty

    list_editable = [
        'image',
        'description',
        'slug'
    ]

    search_fields = [
        'surfzone__name',
    ]

    # autocomplete_fields = [
    #     'surfzone',
    # ]