"""
Unit tests for the CountrySerializer in the SurfQuest project.

These tests validate:
- Correct serialization of a Country instance
- Proper deserialization and saving of valid input data
"""

# ============================
# Django Imports
# ============================
from rest_framework import serializers

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Imports
# ============================
from surfzones.models import Country, Continent
from surfzones.serializers import CountrySerializer


# ============================
# Test Cases for CountrySerializer
# ============================
@pytest.mark.django_db
def test_country_serializer_valid_data():
    """Test that valid data serializes and creates a Country instance."""
    continent = Continent.objects.create(name="South America", code="SA")
    data = {
        "name": "Brazil",
        "code": "BRA",
        "continent": str(continent.id)
    }
    serializer = CountrySerializer(data=data)
    assert serializer.is_valid(), serializer.errors
    country = serializer.save()
    assert country.name == "Brazil"
    assert country.code == "BRA"
    assert country.continent == continent
    assert country.slug == "brazil"


@pytest.mark.django_db
def test_country_serializer_missing_name():
    """Test that missing name field raises validation error."""
    continent = Continent.objects.create(name="Africa", code="AF")
    data = {
        "code": "EGY",
        "continent": str(continent.id)
    }
    serializer = CountrySerializer(data=data)
    assert not serializer.is_valid()
    assert "name" in serializer.errors


@pytest.mark.django_db
def test_country_serializer_output():
    """Test that a Country instance serializes correctly."""
    continent = Continent.objects.create(name="Europe", code="EU")
    country = Country.objects.create(name="France", code="FRA", continent=continent)
    serializer = CountrySerializer(country)
    data = serializer.data
    assert data["name"] == "France"
    assert data["code"] == "FRA"
    assert str(data["continent"]) == str(continent.id)


@pytest.mark.django_db
def test_country_serializer_input():
    """Test that input data can be serialized and saved correctly."""
    continent = Continent.objects.create(name="Asia", code="AS")
    payload = {
        "name": "Japan",
        "code": "JPN",
        "continent": str(continent.id)
    }
    serializer = CountrySerializer(data=payload)
    assert serializer.is_valid(), serializer.errors
    country = serializer.save()
    assert country.name == "Japan"
    assert country.code == "JPN"
    assert country.continent == continent