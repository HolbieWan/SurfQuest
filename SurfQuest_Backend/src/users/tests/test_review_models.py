"""
Unit tests for the Review model in the SurfQuest project.

These tests validate:
- Creation of reviews for surf zones and surf spots
- String representation of the Review model
"""

# ============================
# Django Testing Framework
# ============================
import pytest

# ============================
# Local Imports
# ============================
from users.models import User, Review
from surfzones.models import SurfZone, SurfSpot, Country, Continent


@pytest.mark.django_db
def test_create_review_for_surf_zone():
    """Test that a review can be created for a surf zone."""
    user = User.objects.create_user(username="zoneuser", password="StrongPass123!")
    continent = Continent.objects.create(name="Asia")
    country = Country.objects.create(name="Indonesia", code="ID", continent=continent)
    zone = SurfZone.objects.create(name="Mentawai", country=country)
    review = Review.objects.create(user=user, surf_zone=zone, rating=4, comment="Amazing waves!")
    assert review.user == user
    assert review.surf_zone == zone
    assert review.rating == 4
    assert review.comment == "Amazing waves!"


@pytest.mark.django_db
def test_create_review_for_surf_spot():
    """Test that a review can be created for a surf spot."""
    user = User.objects.create_user(username="spotuser", password="StrongPass123!")
    continent = Continent.objects.create(name="Asia")
    country = Country.objects.create(name="Indonesia", code="ID", continent=continent)
    zone = SurfZone.objects.create(name="Bali", country=country)
    spot = SurfSpot.objects.create(name="Uluwatu", surfzone=zone)
    review = Review.objects.create(user=user, surf_spot=spot, rating=5, comment="Best spot ever!")
    assert review.user == user
    assert review.surf_spot == spot
    assert review.rating == 5
    assert review.comment == "Best spot ever!"


@pytest.mark.django_db
def test_review_string_representation():
    """Test the string representation of a Review instance."""
    user = User.objects.create_user(username="stringuser", password="StrongPass123!")
    continent = Continent.objects.create(name="Africa")
    country = Country.objects.create(name="South Africa", code="ZA", continent=continent)
    zone = SurfZone.objects.create(name="Jeffrey’s Bay", country=country)
    review = Review.objects.create(user=user, surf_zone=zone, rating=3)
    assert str(review) == f"Review by {user.username} - Rating: 3"


@pytest.mark.django_db
def test_unique_review_per_user_per_zone():
    """Test that a user can only submit one review per surf zone."""
    user = User.objects.create_user(username="uniquezone", password="pass")
    continent = Continent.objects.create(name="Oceania")
    country = Country.objects.create(name="Fiji", code="FJ", continent=continent)
    zone = SurfZone.objects.create(name="Cloudbreak", country=country)
    Review.objects.create(user=user, surf_zone=zone, rating=5)
    
    with pytest.raises(Exception):
        Review.objects.create(user=user, surf_zone=zone, rating=4)

@pytest.mark.django_db
def test_unique_review_per_user_per_spot():
    """Test that a user can only submit one review per surf spot."""
    user = User.objects.create_user(username="uniquespot", password="pass")
    continent = Continent.objects.create(name="Europe")
    country = Country.objects.create(name="France", code="FR", continent=continent)
    zone = SurfZone.objects.create(name="Hossegor", country=country)
    spot = SurfSpot.objects.create(name="La Gravière", surfzone=zone)
    Review.objects.create(user=user, surf_spot=spot, rating=5)
    
    with pytest.raises(Exception):
        Review.objects.create(user=user, surf_spot=spot, rating=3)


@pytest.mark.django_db
def test_review_without_comment():
    """Test that a review can be created without a comment."""
    user = User.objects.create_user(username="nocomment", password="pass")
    continent = Continent.objects.create(name="North America")
    country = Country.objects.create(name="USA", code="US", continent=continent)
    zone = SurfZone.objects.create(name="California", country=country)
    review = Review.objects.create(user=user, surf_zone=zone, rating=4)
    assert review.comment == ""
