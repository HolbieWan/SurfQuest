from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, Review

# Register your models here.
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
        'is_active',
        'is_staff',
        'is_superuser',
        'date_joined',
        'last_login',
        'avatar',
        'bio',
        'preferences',
        'budget'
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
        'is_active',
        'avatar',
        'bio',
        'preferences',
        'budget'
    )
    empty_value_display = 'unknown'

fieldsets = UserAdmin.fieldsets + (
    ('Personal Info', {
        'fields': ('country', 'state', 'city', 'zip_code', 'latitude', 'longitude', 'nearest_airport')
    }),
    ('Profile', {
        'fields': ('avatar', 'bio', 'preferences', 'budget')
    }),
)

search_fields = ('id', 'username', 'email', 'first_name', 'last_name', 'country', 'state', 'city', 'zip_code', 'nearest_airport')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'surf_zone',
        'surf_spot',
        'rating',
        'created_at',
        'updated_at'
    )

    list_editable = (
        'user',
        'rating'
    )
    empty_value_display = 'unknown'

    search_fields = ('user__username', 'surf_zone__name', 'surf_spot__name')
    list_filter = ('rating', 'created_at')