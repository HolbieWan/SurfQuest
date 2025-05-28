"""
Unit tests for ConditionSerializer in the SurfQuest conditions app.

These tests ensure that the serializer properly validates and saves surf condition data,
including field validation for ratings, required fields, and valid data cases.
"""

# ============================
# DRF Testing imports
# ============================
import pytest

# ============================
# Standard Library
# ============================
import uuid

# ============================
# Local Application Imports
# ============================
from conditions.models import Condition
from conditions.serializers import ConditionSerializer
from surfzones.models import SurfZone, Country, Continent


@pytest.fixture
def sample_surfzone(db):
    """Fixture for a basic SurfZone instance."""
    continent = Continent.objects.create(name="Europe", code="EU")
    country = Country.objects.create(name="Portugal", continent=continent)
    return SurfZone.objects.create(
        id=uuid.uuid4(),
        name="Nazare",
        country=country,
        latitude=39.6012,
        longitude=-9.0707
    )

@pytest.mark.django_db
def test_condition_serializer_valid_data(sample_surfzone):
    """Test serializer with valid data returns valid and saves correctly."""
    data = {
        "surfzone": str(sample_surfzone.id),
        "month": "March",
        "water_temp_c": 20,
        "swell_size_ft": 6.5,
        "swell_direction": "NW",
        "surf_level": ["Beginner", "Intermediate"],
        "crowd": "Medium",
        "local_surf_rating": 4,
        "world_surf_rating": 4
    }
    serializer = ConditionSerializer(data=data)
    assert serializer.is_valid(), serializer.errors
    instance = serializer.save()
    assert instance.month == "March"
    assert instance.water_temp_c == 20


@pytest.mark.django_db
def test_condition_serializer_missing_required_field():
    """Test serializer with missing required 'surfzone' field is invalid."""
    data = {
        "month": "May",
        "water_temp_c": 22
    }
    serializer = ConditionSerializer(data=data)
    assert not serializer.is_valid()
    assert "surfzone" in serializer.errors


@pytest.mark.django_db
def test_condition_serializer_invalid_rating(sample_surfzone):
    """Test serializer rejects invalid rating value."""
    data = {
        "surfzone": str(sample_surfzone.id),
        "month": "January",
        "local_surf_rating": 6  # Invalid rating (max is 5)
    }
    serializer = ConditionSerializer(data=data)
    assert not serializer.is_valid()
    assert "local_surf_rating" in serializer.errors