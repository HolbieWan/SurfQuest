

"""
Unit tests for the Condition model in the conditions app using pytest.

These tests check the creation, string representation, and uniqueness constraint
for Condition instances.
"""

# ============================
# Third-Party Imports
# ============================
import pytest

# ============================
# Model Imports
# ============================
from conditions.models import Condition
from surfzones.models import SurfZone, Country, Continent

@pytest.fixture
def sample_surfzone(db):
    continent = Continent.objects.create(name="Europe")
    country = Country.objects.create(name="Portugal", code="PT", continent=continent)
    return SurfZone.objects.create(name="Nazare", country=country)

def test_condition_creation(sample_surfzone):
    """Test that a Condition instance can be created and saved."""
    condition = Condition.objects.create(
        surfzone=sample_surfzone,
        month="January",
        water_temp_c=15,
        swell_size_ft=8.0,
        swell_consistency=70
    )
    assert isinstance(condition, Condition)
    assert condition.surfzone.name == "Nazare"
    assert condition.month == "January"

def test_condition_str(sample_surfzone):
    """Test the string representation of a Condition instance."""
    condition = Condition.objects.create(
        surfzone=sample_surfzone,
        month="February",
        water_temp_c=14
    )
    assert str(condition) == "Conditions for Nazare in February"

def test_unique_surfzone_month_constraint(sample_surfzone):
    """Test that only one Condition per surfzone per month can exist."""
    Condition.objects.create(surfzone=sample_surfzone, month="March")
    with pytest.raises(Exception):
        Condition.objects.create(surfzone=sample_surfzone, month="March")


def test_condition_slug_generation(sample_surfzone):
    """Test that the slug is generated correctly when saving a Condition."""
    condition = Condition(
        surfzone=sample_surfzone,
        month="April",
        water_temp_c=16
    )
    condition.save()
    assert condition.slug == "nazare-april"  # Slug should be based on surfzone name and month


def test_condition_slug_uniqueness(sample_surfzone):
    """Test that the slug is unique across different conditions."""
    condition1 = Condition.objects.create(
        surfzone=sample_surfzone,
        month="May",
        water_temp_c=17
    )
    condition2 = Condition.objects.create(
        surfzone=sample_surfzone,
        month="June",
        water_temp_c=18
    )
    assert condition1.slug != condition2.slug  # Slugs should be different for different months


def test_condition_with_blank_fields(sample_surfzone):
    """Test that a Condition can be created with blank fields."""
    condition = Condition.objects.create(
        surfzone=sample_surfzone,
        month="July",
        water_temp_c=None,  # Blank field
        swell_size_ft=None,  # Blank field
    )
    assert condition.water_temp_c is None
    assert condition.swell_size_ft is None
    assert condition.month == "July"
    assert condition.surfzone.name == "Nazare"


def test_condition_with_all_fields(sample_surfzone):
    """Test that a Condition can be created with all fields populated."""
    condition = Condition.objects.create(
        surfzone=sample_surfzone,
        month="August",
        water_temp_c=20,
        swell_size_ft=6.0,
        swell_consistency=80,
        swell_direction="N",
        surf_level=["Beginner", "Intermediate"],
        crowd="Moderate",
        local_surf_rating=4,
        world_surf_rating=5,
        min_air_temp_c=15,
        max_air_temp_c=25,
        rain_quantity=10,
        rain_days=5,
        sunny_days=20,
        wind_force=3,
        wind_direction="E",
        wind_consistency=75
    )
    assert condition.water_temp_c == 20
    assert condition.swell_size_ft == 6.0
    assert condition.swell_consistency == 80
    assert condition.surf_level == ["Beginner", "Intermediate"]
    assert condition.crowd == "Moderate"
    assert condition.local_surf_rating == 4
    assert condition.world_surf_rating == 5
    assert condition.min_air_temp_c == 15
    assert condition.max_air_temp_c == 25
    assert condition.rain_quantity == 10
    assert condition.rain_days == 5
    assert condition.sunny_days == 20
    assert condition.wind_force == 3
    assert condition.wind_direction == "E"
    assert condition.wind_consistency == 75


def test_condition_with_invalid_surfzone():
    """Test that creating a Condition with an invalid surfzone raises an error."""
    with pytest.raises(Exception):
        Condition.objects.create(
            surfzone=None,  # Invalid surfzone
            month="September",
            water_temp_c=19
        )

