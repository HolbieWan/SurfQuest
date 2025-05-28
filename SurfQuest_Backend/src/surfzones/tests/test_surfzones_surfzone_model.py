"""
Unit tests for the SurfZone model in the surfzones app.

These tests verify:
- Creation of SurfZone instances
- Automatic slug generation
- Unique constraint on (name, country)
- __str__ method behavior
"""

# ============================
# Django Imports
# ============================
from django.db.utils import IntegrityError

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Application Imports
# ============================
from surfzones.models import SurfZone, Country, Continent


@pytest.mark.django_db
def test_create_surfzone_with_minimal_fields():
    continent = Continent.objects.create(name="Europe", code="EU")
    country = Country.objects.create(name="France", code="FRA", continent=continent)
    zone = SurfZone.objects.create(name="Hossegor", country=country)
    assert zone.name == "Hossegor"
    assert zone.slug == "hossegor"
    assert zone.country == country


@pytest.mark.django_db
def test_create_surfzone_with_all_fields():
    continent = Continent.objects.create(name="South America", code="SA")
    country = Country.objects.create(name="Brazil", code="BRA", continent=continent)
    zone = SurfZone.objects.create(
        name="Praia do Norte",
        country=country,
        description="Famous for its big waves.",
        latitude=-23.949,
        longitude=-46.333,
    )
    assert zone.name == "Praia do Norte"
    assert zone.slug == "praia-do-norte"
    assert zone.description == "Famous for its big waves."
    assert zone.latitude == -23.949
    assert zone.longitude == -46.333


@pytest.mark.django_db
def test_surfzone_slug_is_auto_generated():
    continent = Continent.objects.create(name="Asia", code="AS")
    country = Country.objects.create(name="Indonesia", code="IDN", continent=continent)
    zone = SurfZone.objects.create(name="Mentawai Islands", country=country)
    assert zone.slug == "mentawai-islands"


@pytest.mark.django_db
def test_surfzone_str_representation():
    continent = Continent.objects.create(name="Africa", code="AF")
    country = Country.objects.create(name="Morocco", code="MAR", continent=continent)
    zone = SurfZone.objects.create(name="Taghazout", country=country)
    assert str(zone) == "Taghazout"


@pytest.mark.django_db
def test_unique_surfzone_name_per_country():
    continent = Continent.objects.create(name="North America", code="NA")
    country = Country.objects.create(name="USA", code="USA", continent=continent)
    SurfZone.objects.create(name="Malibu", country=country)
    with pytest.raises(IntegrityError):
        SurfZone.objects.create(name="Malibu", country=country)
