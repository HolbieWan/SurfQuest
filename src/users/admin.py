from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User

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


