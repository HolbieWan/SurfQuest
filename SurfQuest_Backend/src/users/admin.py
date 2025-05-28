"""
Admin configuration for the Users app in the SurfQuest project.

Registers the custom User model and Review model with enhanced admin display,
editing, and search capabilities.
"""

# ============================
# Django Admin Imports
# ============================
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin   # Inherit default UserAdmin behavior

# ============================
# Local App Models
# ============================
from .models import User, Review


# ============================
# Admin: Custom User
# ============================
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'country',
        'state',
        'city',
        'zip_code',
        'latitude',
        'longitude',
        'nearest_airport',
        'is_active',
        'is_staff',
        'is_superuser',
        'date_joined',
        'last_login',
        'avatar',
        'bio',
        'preferences',
        'budget',
        'slug'
    )

    list_editable = (
        'username',
        'email',
        'first_name',
        'last_name',
        'country',
        'state',
        'city',
        'zip_code',
        'latitude',
        'longitude',
        'nearest_airport',
        'is_active',
        'avatar',
        'bio',
        'preferences',
        'budget',
        'slug'
    )

    empty_value_display = 'unknown'   # Display when a field is empty

# ============================
# Custom fieldsets to show extended profile fields in admin
# ============================
fieldsets = UserAdmin.fieldsets + (
    ('Personal Info', {
        'fields': ('country', 'state', 'city', 'zip_code', 'latitude', 'longitude', 'nearest_airport')
    }),
    ('Profile', {
        'fields': ('avatar', 'bio', 'preferences', 'budget')
    }),
)

# Enable search on these fields in the admin panel
search_fields = (
    'id', 'username', 'email',
    'first_name', 'last_name',
    'country', 'state', 'city', 'zip_code', 'nearest_airport'
)


# ============================
# Admin: Review
# ============================
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'surf_zone',
        'surf_spot',
        'rating',
        'comment',
        'created_at',
        'updated_at'
    )

    list_editable = (
        'rating',
        'comment'
    )

    empty_value_display = 'unknown'   # Display when a field is empty

    search_fields = ('user__username', 'surf_zone__name', 'surf_spot__name')
    list_filter = ('rating', 'created_at')