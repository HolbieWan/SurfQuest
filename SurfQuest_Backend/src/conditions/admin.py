"""
Admin configuration for the Conditions app in the SurfQuest project.

Registers the Condition model with custom display, search, and editing options
for the Django admin interface.
"""

# ============================
# Django Admin Import
# ============================
from django.contrib import admin

# ============================
# Local App Model
# ============================
from .models import Condition

# ============================
# Admin: Condition
# ============================
@admin.register(Condition)
class ConditionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'surfzone',
        'month',
        'water_temp_c',
        'water_temp_f',
        'swell_size_ft',
        'swell_size_meter',
        'swell_consistency',
        'swell_direction',
        'surf_level',
        'crowd',
        'local_surf_rating',
        'world_surf_rating',
        'min_air_temp_c',
        'min_air_temp_f',
        'max_air_temp_c',
        'max_air_temp_f',
        'rain_quantity',
        'rain_days',
        'sunny_days',
        'wind_force',
        'wind_direction',
        'wind_consistency',
        'slug',
    )

    empty_value_display = 'unknown'

    list_editable = (
        'month',
        'water_temp_c',
        'water_temp_f',
        'swell_size_ft',
        'swell_size_meter',
        'swell_consistency',
        'swell_direction',
        'surf_level',
        'crowd',
        'local_surf_rating',
        'world_surf_rating',
        'min_air_temp_c',
        'min_air_temp_f',
        'max_air_temp_c',
        'max_air_temp_f',
        'rain_quantity',
        'rain_days',
        'sunny_days',
        'wind_force',
        'wind_direction',
        'wind_consistency',
    )
    
    search_fields = [
        'surfzone__name',   # Enables searching by surf zone name
        'month',            # Enables searching by month
    ]

    # autocomplete_fields = [
    #     'surfzone',
    # ]