

"""
Unit tests for the Continent model in the SurfQuest project.

These tests cover:
- String representation of Continent
- Slug generation on save
- Unique constraints on name and code
"""

# ============================
# Django Imports
# ============================
from django.db import IntegrityError

# ============================
# DRF Testing Imports
# ============================
import pytest

# ============================
# Local Imports
# ============================
from surfzones.models import Continent


# ============================
# Test Cases for Continent Model
# ============================

@pytest.mark.django_db
def test_continent_str_representation():
    """Test that the string representation returns the continent name."""
    continent = Continent.objects.create(name="Europe", code="EU")
    assert str(continent) == "Europe"

@pytest.mark.django_db
def test_continent_slug_generation():
    """Test that a slug is automatically generated from the name."""
    continent = Continent.objects.create(name="North America", code="NA")
    assert continent.slug == "north-america"

@pytest.mark.django_db
def test_unique_constraint_on_name_and_code():
    """Test that creating a duplicate continent with same name and code raises an IntegrityError."""
    Continent.objects.create(name="Asia", code="AS")
    with pytest.raises(IntegrityError):
        Continent.objects.create(name="Asia", code="AS")
