

"""
Unit tests for the SurfSpotImage model in the surfzones app.

These tests validate image creation, automatic slug generation, blank description handling,
and the string representation method of SurfSpotImage instances.
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
from surfzones.models import Continent, Country, SurfZone, SurfSpot, SurfSpotImage

@pytest.mark.django_db
def test_surfspot_image_creation_and_slug_generation():
    """
    Test that a SurfSpotImage instance is created correctly with a slug and string representation.
    """
    continent = Continent.objects.create(name="Oceania", code="OC")
    country = Country.objects.create(name="Australia", code="AUS", continent=continent)
    surfzone = SurfZone.objects.create(name="Gold Coast", country=country)
    surfspot = SurfSpot.objects.create(name="Snapper Rocks", surfzone=surfzone)
    
    fake_image = SimpleUploadedFile("snapper.jpg", b"file_content", content_type="image/jpeg")
    image_instance = SurfSpotImage.objects.create(
        surfspot=surfspot,
        image=fake_image,
        description="A famous right-hand point break."
    )

    assert image_instance.slug.startswith(slugify("Snapper Rocks"))
    assert image_instance.description == "A famous right-hand point break."
    assert str(image_instance).startswith("Image for Snapper Rocks")


@pytest.mark.django_db
def test_surfspot_image_blank_description():
    """
    Test that a SurfSpotImage can be created without a description and defaults to an empty string.
    """
    continent = Continent.objects.create(name="Africa", code="AF")
    country = Country.objects.create(name="Morocco", code="MAR", continent=continent)
    surfzone = SurfZone.objects.create(name="Taghazout Bay", country=country)
    surfspot = SurfSpot.objects.create(name="Anchor Point", surfzone=surfzone)

    fake_image = SimpleUploadedFile("anchor.jpg", b"file_content", content_type="image/jpeg")
    image_instance = SurfSpotImage.objects.create(
        surfspot=surfspot,
        image=fake_image
    )

    assert image_instance.description == ""
    assert str(image_instance).startswith("Image for Anchor Point")


@pytest.mark.django_db
def test_surfspot_image_str_method():
    """
    Test the __str__ method of SurfSpotImage returns the correct format including the surfspot name.
    """
    continent = Continent.objects.create(name="North America", code="NA")
    country = Country.objects.create(name="USA", code="USA", continent=continent)
    surfzone = SurfZone.objects.create(name="Malibu", country=country)
    surfspot = SurfSpot.objects.create(name="First Point", surfzone=surfzone)

    fake_image = SimpleUploadedFile("first_point.jpg", b"file_content", content_type="image/jpeg")
    image_instance = SurfSpotImage.objects.create(
        surfspot=surfspot,
        image=fake_image,
        description="Iconic surf spot with long rides."
    )

    assert str(image_instance) == "Image for First Point"
