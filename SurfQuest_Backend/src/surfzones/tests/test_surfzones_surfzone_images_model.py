"""
Tests for the SurfZoneImage model in the surfzones app.

These tests verify that image slugs are generated correctly and that
the string representation of SurfZoneImage instances is accurate.
"""

# ============================
# Django Imports
# ============================
from django.utils.text import slugify
from django.core.files.uploadedfile import SimpleUploadedFile

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Application Imports
# ============================
from surfzones.models import Continent, Country, SurfZone, SurfZoneImage


# ============================
# Test Cases
# ============================
@pytest.mark.django_db
def test_surfzone_image_slug_autogeneration():
    """Test that the slug is automatically generated from the surfzone name."""
    # Setup basic location models
    continent = Continent.objects.create(name="Oceania", code="OC")
    country = Country.objects.create(name="Fiji", code="FJI", continent=continent)
    surfzone = SurfZone.objects.create(name="Cloudbreak", country=country)

    # Mock image file
    image_file = SimpleUploadedFile("cloudbreak.jpg", b"file_content", content_type="image/jpeg")

    # Create image object
    image = SurfZoneImage.objects.create(surfzone=surfzone, image=image_file)

    # Ensure slug is correctly generated
    assert image.slug.startswith(slugify("Cloudbreak"))
    assert "cloudbreak" in image.slug

@pytest.mark.django_db
def test_surfzone_image_str_method():
    """Test the __str__ method returns the correct description for the image."""
    continent = Continent.objects.create(name="Africa", code="AF")
    country = Country.objects.create(name="Morocco", code="MAR", continent=continent)
    surfzone = SurfZone.objects.create(name="Taghazout", country=country)

    image_file = SimpleUploadedFile("taghazout.jpg", b"file_content", content_type="image/jpeg")
    image = SurfZoneImage.objects.create(surfzone=surfzone, image=image_file)

    assert str(image) == "Image for Taghazout"
