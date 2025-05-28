"""
Tests for the SurfSpot serializer.

These tests cover the correct serialization of SurfSpot instances,
including handling of invalid and blank field cases.
"""

# ============================
# Third-Party Imports
# ============================
import pytest

# ============================
# DRF Testing Imports
# ============================
from surfzones.models import Continent, Country, SurfZone, SurfSpot
from surfzones.serializers import SurfSpotSerializer


# ============================
# Test Cases
# ============================
@pytest.mark.django_db
def test_surfspot_serializer_output():
    """
    Test that the SurfSpot serializer correctly serializes a complete surf spot object.
    """
    continent = Continent.objects.create(name="Africa", code="AF")
    country = Country.objects.create(name="Morocco", code="MAR", continent=continent)
    surfzone = SurfZone.objects.create(name="Taghazout", country=country)
    surfspot = SurfSpot.objects.create(
        name="Anchor Point",
        surfzone=surfzone,
        latitude=30.528,
        longitude=-9.706,
        break_type="Reef",
        wave_direction="Right",
        best_wind_direction="NE",
        best_swell_direction="NW",
        best_swell_size_feet=6.0,
        best_swell_size_meter=1.8,
        best_tide=["Mid", "High"],
        surf_level=["Intermediate", "Advanced"],
        surf_hazards=["Rocks"],
        best_months=["JAN", "FEB", "DEC"],
        description="Long right-hand point break"
    )

    serializer = SurfSpotSerializer(surfspot)
    data = serializer.data

    assert data["name"] == "Anchor Point"
    assert data["surfzone"]["name"] == "Taghazout"
    assert "spot_images" in data


@pytest.mark.django_db
def test_surfspot_serializer_with_invalid_data():
    """
    Test that the serializer validation fails with invalid input data (wrong latitude type).
    """
    continent = Continent.objects.create(name="Asia", code="AS")
    country = Country.objects.create(name="Indonesia", code="IDN", continent=continent)
    surfzone = SurfZone.objects.create(name="Bali", country=country)
    surfspot = SurfSpot.objects.create(
        name="Uluwatu",
        surfzone=surfzone,
        latitude=8.829,
        longitude=115.086,
        break_type="Reef",
        wave_direction="Left",
        best_wind_direction="SE",
        best_swell_direction="SW",
        best_swell_size_feet=8.0,
        best_swell_size_meter=2.4,
        best_tide=["Mid"],
        surf_level=["Advanced"],
        surf_hazards=["Coral Reefs"],
        best_months=["JUN", "JUL", "AUG"],
        description="Famous reef break with powerful waves"
    )

    input_data = {
        "name": "Uluwatu",
        "surfzone": surfzone.id,
        "latitude": "invalid_latitude",  # Invalid data type
        "longitude": 115.086,
    }
    
    serializer = SurfSpotSerializer(surfspot, data=input_data)
    is_valid = serializer.is_valid()

    assert not is_valid
    assert "latitude" in serializer.errors


@pytest.mark.django_db
def test_surfspot_serializer_blank_fields():
    """
    Test serialization when optional fields are left blank or set to None.
    """
    continent = Continent.objects.create(name="Oceania", code="OC")
    country = Country.objects.create(name="Australia", code="AUS", continent=continent)
    surfzone = SurfZone.objects.create(name="Byron Bay", country=country)
    surfspot = SurfSpot.objects.create(
        name="First Point",
        surfzone=surfzone,
        break_type="Beach",
        wave_direction="Right",
        best_wind_direction="NE",
        best_swell_direction="NW",
        latitude=None,
        longitude=None,
        best_swell_size_feet=None,
        best_swell_size_meter=None,
        best_tide=[],
        surf_level=[],
        surf_hazards=[],
        best_months=[],
        description=""
    )

    serializer = SurfSpotSerializer(surfspot)
    data = serializer.data

    assert data["name"] == "First Point"
    assert data["surfzone"]["name"] == "Byron Bay"
    assert data["latitude"] is None
    assert data["longitude"] is None
