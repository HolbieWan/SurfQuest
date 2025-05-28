
"""
Unit tests for the Country model in the SurfQuest project.

These tests validate:
- The creation and string representation of Country instances
- Automatic slug generation based on the country's name
- Enforcement of the unique constraint on country name per continent
"""

# ============================
# Django Imports
# ============================
from django.db import IntegrityError

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Application Imports
# ============================
from surfzones.models import Country, Continent


@pytest.mark.django_db
def test_create_country_and_str_representation():
    """
    Test that a Country can be created, its string representation matches its name,
    and the slug is automatically generated from the name.
    """
    continent = Continent.objects.create(name="Europe", code="EU")
    country = Country.objects.create(name="France", code="FRA", continent=continent)
    assert str(country) == "France"
    assert country.slug == "france"
    assert country.continent == continent


@pytest.mark.django_db
def test_country_slug_generation():
    """
    Test that a slug is automatically generated when creating a Country.
    """
    continent = Continent.objects.create(name="North America", code="NA")
    country = Country.objects.create(name="Canada", code="CAN", continent=continent)
    assert country.slug == "canada"


@pytest.mark.django_db
def test_country_unique_constraint_per_continent():
    """
    Test that creating two countries with the same name in the same continent raises an IntegrityError.
    """
    continent = Continent.objects.create(name="Asia", code="AS")
    Country.objects.create(name="India", code="IND", continent=continent)
    with pytest.raises(IntegrityError):
        Country.objects.create(name="India", code="XYZ", continent=continent)  # Same name + continent