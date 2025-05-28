"""
Unit tests for the ContinentSerializer in the SurfQuest project.

These tests validate:
- Correct serialization of Continent model instances
- Correct deserialization and creation of Continent objects from valid data
- Validation behavior on missing required fields
"""

# ============================
# Django Imports
# ============================
from rest_framework.serializers import ValidationError

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Imports
# ============================
from surfzones.models import Continent
from surfzones.serializers import ContinentSerializer


# ============================
# Test Cases for ContinentSerializer
# ============================
@pytest.mark.django_db
def test_continent_serializer_valid_data():
    """Test that valid data serializes and creates a Continent instance."""
    data = {"name": "Europe", "code": "EU"}
    serializer = ContinentSerializer(data=data)
    assert serializer.is_valid()
    continent = serializer.save()
    assert continent.name == "Europe"
    assert continent.code == "EU"
    assert continent.slug == "europe"


@pytest.mark.django_db
def test_continent_serializer_missing_name():
    """Test that missing name field raises validation error."""
    data = {"code": "EU"}
    serializer = ContinentSerializer(data=data)
    assert not serializer.is_valid()
    assert "name" in serializer.errors


@pytest.mark.django_db
def test_continent_serializer_output_format():
    """Test serialization output structure of a Continent instance."""
    continent = Continent.objects.create(name="Africa", code="AF")
    serializer = ContinentSerializer(continent)
    assert serializer.data["name"] == "Africa"
    assert serializer.data["code"] == "AF"
    assert "id" in serializer.data
    assert "slug" in serializer.data
