from django.contrib import admin
from .models import Country, Continent, SurfZone, SurfSpot, SurfSpotImage, SurfZoneImage

# Register your models here.
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'code',
        'continent'
        )
    empty_value_display = 'unknown'


@admin.register(Continent)
class ContinentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'code',
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
        'latitude',
        'longitude',
        'solo',
        'couple',
        'family',
        'safety',
        'health',
        'confort',
        'cost',
        'language',
        'currency',
        'religion',
        'surroundings',
        'description',
        'lefts',
        'rights',
        'left_and_rights',
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
    )
    empty_value_display = 'unknown'


@admin.register(SurfSpotImage)
class SurfSpotImageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'surfspot',
        'image',
    )
    empty_value_display = 'unknown'


@admin.register(SurfZoneImage)
class SurfZoneImageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'surfzone',
        'image',
    )
    empty_value_display = 'unknown'