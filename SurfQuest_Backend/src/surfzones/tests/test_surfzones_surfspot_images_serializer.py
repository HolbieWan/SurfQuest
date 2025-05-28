
"""
Tests for the SurfSpotImageSerializer in the surfzones app.

This module verifies that:
- Serialized output includes expected fields.
- Description can be blank.
- The image field is required during validation.
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
from surfzones.models import Continent, Country, SurfZone, SurfSpot, SurfSpotImage
from surfzones.serializers import SurfSpotImageSerializer

# ============================
# Test Cases
# ============================
@pytest.mark.django_db
def test_surfspot_image_serializer_output():
    """
    Test that the SurfSpotImageSerializer outputs the correct fields.
    """
    continent = Continent.objects.create(name="Europe", code="EU")
    country = Country.objects.create(name="Spain", code="ESP", continent=continent)
    surfzone = SurfZone.objects.create(name="Mundaka", country=country)
    surfspot = SurfSpot.objects.create(name="Mundaka Point", surfzone=surfzone)

    image_file = SimpleUploadedFile("mundaka.jpg", b"file_content", content_type="image/jpeg")
    image_instance = SurfSpotImage.objects.create(
        surfspot=surfspot,
        image=image_file,
        description="Iconic left-hand wave"
    )

    serializer = SurfSpotImageSerializer(image_instance)
    data = serializer.data

    assert data["id"] == str(image_instance.id)
    assert "image" in data
    assert data["description"] == "Iconic left-hand wave"
    assert str(data["surfspot"]) == str(surfspot.id)

@pytest.mark.django_db
def test_surfspot_image_serializer_blank_description():
    """
    Test that the SurfSpotImageSerializer allows a blank description.
    """ 
    continent = Continent.objects.create(name="Oceania", code="OC")
    country = Country.objects.create(name="Australia", code="AUS", continent=continent)
    surfzone = SurfZone.objects.create(name="Gold Coast", country=country)
    surfspot = SurfSpot.objects.create(name="Snapper Rocks", surfzone=surfzone)

    image_file = SimpleUploadedFile("snapper.jpg", b"image_data", content_type="image/jpeg")
    image_instance = SurfSpotImage.objects.create(
        surfspot=surfspot,
        image=image_file
    )

    serializer = SurfSpotImageSerializer(image_instance)
    data = serializer.data

    assert data["description"] == ""

@pytest.mark.django_db
def test_surfspot_image_serializer_missing_image_field():
    """
    Test that the SurfSpotImageSerializer raises an error when the image field is missing.
    """
    continent = Continent.objects.create(name="Africa", code="AF")
    country = Country.objects.create(name="Morocco", code="MAR", continent=continent)
    surfzone = SurfZone.objects.create(name="Taghazout", country=country)
    surfspot = SurfSpot.objects.create(name="Anchor Point", surfzone=surfzone)

    input_data = {
        "surfspot": surfspot.id,
        "description": "Missing image file"
    }
    serializer = SurfSpotImageSerializer(data=input_data)
    is_valid = serializer.is_valid()

    assert not is_valid
    assert "image" in serializer.errors