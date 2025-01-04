from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, Country, Continent

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
        'is_active'
    )
    empty_value_display = 'unknown'


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
