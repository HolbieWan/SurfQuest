"""
Unit tests for the SurfZoneSerializer in the SurfQuest project.

These tests validate:
- Correct serialization and deserialization of SurfZone data
- Output format with nested relationships
"""

# ============================
# Django Imports
# ============================
from rest_framework.exceptions import ValidationError

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Imports
# ============================
from surfzones.models import SurfZone, Country, Continent
from surfzones.serializers import SurfZoneSerializer


# ============================
# Test Cases for SurfZoneSerializer
# ============================
@pytest.mark.django_db
def test_surfzone_serializer_valid_data():
    """Test that valid SurfZone data serializes correctly."""
    continent = Continent.objects.create(name="Europe", code="EU")
    country = Country.objects.create(name="France", code="FRA", continent=continent)
    surfzone = SurfZone.objects.create(
        name="Hossegor",
        country=country,
        latitude=43.665,
        longitude=-1.427,
        nearest_city="Bayonne",
        nearest_airport="Biarritz",
        traveler_type=["solo"],
        safety="safe",
        health_hazards=["jellyfish"],
        surf_hazards=["rocks"],
        best_months=["JUN", "JUL", "AUG"],
        confort="medium",
        cost="medium",
        language="French",
        currency="EUR",
        religion="None",
        surroundings="forest",
        description="Famous surf zone in SW France",
        main_wave_direction="W"
    )
    serializer = SurfZoneSerializer(surfzone)
    data = serializer.data
    assert data["name"] == "Hossegor"
    assert data["country"]["id"] == str(country.id)
    assert "slug" in data


# @pytest.mark.django_db
# def test_surfzone_serializer_input_valid():
#     continent = Continent.objects.create(name="Asia", code="AS")
#     country = Country.objects.create(name="Sri Lanka", code="LKA", continent=continent)
#     input_data = {
#         "name": "Arugam Bay",
#         "country": {
#                 "id": str(country.id),
#                 "name": "Sri Lanka",
#                 "code": "LKA"
#             },
#         "latitude": 6.842,
#         "longitude": 81.833,
#         "traveler_type": ["Family"],
#         "safety": "High",
#         "best_months": ["May", "June"],
#         "confort": "Comfortable",
#         "description": "A popular surf spot in Sri Lanka known for its consistent waves.",
#         "nearest_city": "Pottuvil",
#         "nearest_airport": "Batticaloa Airport",
#         "health_hazards": ["sunburn"],
#         "surf_hazards": ["rocks", "currents"],
#         "zone_images": [],
#         "religion": "Buddhism",
#         "surroundings": "beach",
#         "surf_level": "Intermediate",
#         "break_type": "Beach break",
#         "best_tide": "Mid",
#         "wave_direction": "Left and right",
#         "cost": "Cheap",
#         "language": "Sinhala",
#         "currency": "LKR",
#         "main_wave_direction": "Right"
#     }
#     serializer = SurfZoneSerializer(data=input_data, context={"request": None})
#     assert serializer.is_valid(), serializer.errors
#     instance = serializer.save()
#     assert instance.slug == "arugam-bay"


@pytest.mark.django_db
def test_surfzone_serializer_missing_required_field():
    """Test that missing required fields raises validation error."""
    continent = Continent.objects.create(name="Oceania", code="OC")
    country = Country.objects.create(name="Australia", code="AUS", continent=continent)
    data = {
        "country": str(country.id)
    }
    serializer = SurfZoneSerializer(data=data)
    assert not serializer.is_valid()
    assert "name" in serializer.errors


@pytest.mark.django_db
def test_surfzone_serializer_output_format():
    """Test that the SurfZoneSerializer outputs the correct format."""
    continent = Continent.objects.create(name="South America", code="SA")
    country = Country.objects.create(name="Peru", code="PER", continent=continent)
    surfzone = SurfZone.objects.create(
        name="Punta Hermosa",
        country=country,
        latitude=-12.416,
        longitude=-76.800
    )
    serializer = SurfZoneSerializer(surfzone)
    data = serializer.data
    assert "id" in data
    assert "name" in data
    assert "slug" in data
    assert "country" in data
    assert "latitude" in data
    assert "longitude" in data


@pytest.mark.django_db
def test_surfzone_serializer_nested_country_data():
    """Test that the SurfZoneSerializer includes nested country data."""
    continent = Continent.objects.create(name="Africa", code="AF")
    country = Country.objects.create(name="Morocco", code="MAR", continent=continent)
    surfzone = SurfZone.objects.create(
        name="Taghazout",
        country=country,
        latitude=30.550,
        longitude=-9.600
    )
    serializer = SurfZoneSerializer(surfzone)
    data = serializer.data
    assert data["country"]["name"] == "Morocco"
    assert data["country"]["code"] == "MAR"
    assert str(data["country"]["continent"]) == str(continent.id)
