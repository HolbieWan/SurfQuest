from django.contrib import admin
from .models import Condition

# Register your models here.
@admin.register(Condition)
class ConditionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'surfzone',
        'month',
        'water_temp',
        'swell_size_ft',
        'swell_size_meter',
        'swell_consistency',
        'swell_direction',
        'beginner',
        'intermediate',
        'advanced',
        'pro',
        'crowd',
        'local_surf_rating',
        'world_surf_rating',
        'min_air_temp',
        'max_air_temp',
        'rain_quantity',
        'rain_days',
        'sunny_days',
        'wind_force',
        'wind_direction',
        'wind_consistency',
    )
    