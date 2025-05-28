"""
Tests for the SurfZoneImageSerializer in the surfzones app.

This module verifies the correct serialization of SurfZoneImage instances under different conditions,
including valid data, missing image, and missing description.
"""

# ============================
# Django Imports
# ============================
from django.core.files.uploadedfile import SimpleUploadedFile

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Application Imports
# ============================
from surfzones.models import Continent, Country, SurfZone, SurfZoneImage
from surfzones.serializers import SurfZoneImageSerializer


# =============================
# Test Cases
# =============================
@pytest.mark.django_db
def test_surfzone_image_serializer_output():
    """Test serializer output for a valid SurfZoneImage instance with image and description."""
    continent = Continent.objects.create(name="Oceania", code="OC")
    country = Country.objects.create(name="Australia", code="AUS", continent=continent)
    surfzone = SurfZone.objects.create(name="Gold Coast", country=country)
    fake_image = SimpleUploadedFile("surf.jpg", b"file_content", content_type="image/jpeg")
    image_instance = SurfZoneImage.objects.create(
        surfzone=surfzone,
        image=fake_image,
        description="Beautiful wave image"
    )
    serializer = SurfZoneImageSerializer(image_instance)
    data = serializer.data
    assert data["id"] == str(image_instance.id)
    assert "image" in data
    assert data["description"] == "Beautiful wave image"
    assert data["slug"] == image_instance.slug
    assert "created_at" in data


@pytest.mark.django_db
def test_surfzone_image_serializer_with_invalid_data():
    """Test serializer output when SurfZoneImage is created without an image file."""
    continent = Continent.objects.create(name="Asia", code="AS")
    country = Country.objects.create(name="Japan", code="JPN", continent=continent)
    surfzone = SurfZone.objects.create(name="Shonan", country=country)
    
    # Create an image instance without a file
    image_instance = SurfZoneImage.objects.create(
        surfzone=surfzone,
        description="Empty image"
    )
    
    serializer = SurfZoneImageSerializer(image_instance)
    data = serializer.data
    
    assert data["id"] == str(image_instance.id)
    assert data["image"] is None
    assert data["description"] == "Empty image"


@pytest.mark.django_db
def test_surfzone_image_serializer_with_missing_fields():
    """Test serializer output when SurfZoneImage is created without a description."""
    continent = Continent.objects.create(name="Europe", code="EU")
    country = Country.objects.create(name="Portugal", code="PRT", continent=continent)
    surfzone = SurfZone.objects.create(name="Ericeira", country=country)
    
    # Create an image instance without a description
    fake_image = SimpleUploadedFile("ericeira.jpg", b"file_content", content_type="image/jpeg")
    image_instance = SurfZoneImage.objects.create(
        surfzone=surfzone,
        image=fake_image
    )
    
    serializer = SurfZoneImageSerializer(image_instance)
    data = serializer.data
    
    assert data["id"] == str(image_instance.id)
    assert data["description"] == ""