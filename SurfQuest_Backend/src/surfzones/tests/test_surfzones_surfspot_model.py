"""
Tests for the SurfSpot model in the surfzones app.

These tests verify:
- Basic creation and field assignments.
- Automatic slug generation.
- String representation.
- Access to related SurfZone, Country, and Continent data.
"""

# ============================
# Django Imports
# ============================
from django.utils.text import slugify

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Imports
# ===========================
from surfzones.models import Continent, Country, SurfZone, SurfSpot


# ============================
# Test Cases
# ============================
@pytest.mark.django_db
def test_create_surfspot_basic_fields():
# Test creating a SurfSpot with full data and verifying field values and slug
    continent = Continent.objects.create(name="Europe", code="EU")
    country = Country.objects.create(name="France", code="FRA", continent=continent)
    surfzone = SurfZone.objects.create(name="Hossegor", country=country)

    surfspot = SurfSpot.objects.create(
        name="La Gravière",
        surfzone=surfzone,
        latitude=43.660,
        longitude=-1.430,
        break_type="Beach break",
        wave_direction="Left",
        best_wind_direction="NE",
        best_swell_direction="NW",
        best_swell_size_feet=5.5,
        best_swell_size_meter=1.7,
        best_tide=["Mid"],
        surf_level=["Intermediate"],
        surf_hazards=["rocks"],
        best_months=["JUL", "AUG"],
        description="Powerful beach break known for barrels."
    )

    assert surfspot.name == "La Gravière"
    assert surfspot.surfzone == surfzone
    assert surfspot.latitude == 43.660
    assert surfspot.break_type == "Beach break"
    assert slugify("La Gravière") in surfspot.slug

@pytest.mark.django_db
def test_surfspot_auto_slug_generation():
    # Test that the slug is auto-generated correctly from the name
    continent = Continent.objects.create(name="Africa", code="AF")
    country = Country.objects.create(name="Morocco", code="MAR", continent=continent)
    surfzone = SurfZone.objects.create(name="Taghazout", country=country)

    surfspot = SurfSpot.objects.create(name="Anchor Point", surfzone=surfzone)

    assert surfspot.slug.startswith("anchor-point")

@pytest.mark.django_db
def test_surfspot_str_method():
    # Test the __str__ method returns the SurfSpot name
    continent = Continent.objects.create(name="Asia", code="AS")
    country = Country.objects.create(name="Sri Lanka", code="LKA", continent=continent)
    surfzone = SurfZone.objects.create(name="Arugam Bay", country=country)
    surfspot = SurfSpot.objects.create(name="Main Point", surfzone=surfzone)

    assert str(surfspot) == "Main Point"


@pytest.mark.django_db
def test_surfspot_related_data():
    # Test access to related SurfZone, Country, and Continent data
    continent = Continent.objects.create(name="North America", code="NA")
    country = Country.objects.create(name="USA", code="USA", continent=continent)
    surfzone = SurfZone.objects.create(name="Malibu", country=country)

    surfspot = SurfSpot.objects.create(
        name="First Point",
        surfzone=surfzone,
        latitude=34.025,
        longitude=-118.779,
        break_type="Point break",
        wave_direction="Right",
        best_wind_direction="SW",
        best_swell_direction="W",
        best_swell_size_feet=3.0,
        best_swell_size_meter=0.9,
        best_tide=["Low"],
        surf_level=["Advanced"],
        surf_hazards=["rocks"],
        best_months=["SEP", "OCT"]
    )

    assert surfspot.surfzone.country.name == "USA"
    assert surfspot.surfzone.country.continent.name == "North America"
