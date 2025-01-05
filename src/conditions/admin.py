from django.contrib import admin
from .models import Conditions

# Register your models here.
@admin.register(Conditions)
class ConditionAdmin(admin.ModelAdmin):
    list_display = (
        'surfzone',
        'month',
        'water_temp',
        'swell_size',
        'swell_consistancy',
        'swell_direction',
        'beginers',
        'intermediate',
        'advanced',
        'pro',
        'crowds',
        'local_surf_quality',
        'global_surf_rating',
        'min_air_temp',
        'max_air_temp',
        'rain_quantity',
        'rain_days',
        'wind_force',
        'wind_direction',
        'wind_consistency'
        )