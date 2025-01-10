from django.contrib import admin
from .models import Country, Continent, SurfZone, SurfSpot, SurfSpotImage, SurfZoneImage

# Register your models here.
@admin.register(Continent)
class ContinentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'code',
        'slug'
    )
    empty_value_display = 'unknown'

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'code',
        'continent',
        'slug'
    )
    empty_value_display = 'unknown'

@admin.register(SurfZone)
class SurfZoneAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'country',
        'nearest_city',
        'nearest_airport',
        'airport_latitude',
        'airport_longitude',
        'solo',
        'couple',
        'family',
        'safety',
        'health_hazards',
        'surf_hazards',
        'best_month',
        'confort',
        'cost',
        'language',
        'currency',
        'religion',
        'surroundings',
        'description',
        'lefts',
        'rights',
        'lefts_and_rights',
        'slug'
    )
    empty_value_display = 'unknown'


@admin.register(SurfSpot)
class SurfSpotAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'surfzone',
        'latitude',
        'longitude',
        'break_type',
        'left',
        'right',
        'left_and_right',
        'best_wind_direction',
        'best_swell_direction',
        'best_swell_size',
        'best_tide',
        'surf_level',
        'surf_hazards',
        'best_months',
        'description',
        'slug'
    )
    empty_value_display = 'unknown'


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
    empty_value_display = 'unknown'


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
    empty_value_display = 'unknown'