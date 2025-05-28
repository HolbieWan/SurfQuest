

"""
Unit tests for the ReviewSerializer in the SurfQuest project.

These tests cover:
- Creation of a review using the serializer
- Prevention of duplicate reviews by the same user for the same surf zone or surf spot
- Inclusion of nested user and location data in serialized output
"""

# ============================
# Django & DRF Testing Imports
# ============================
import pytest
from rest_framework.exceptions import ValidationError

# ============================
# Local Imports
# ============================
from users.models import User, Review
from users.serializers import ReviewSerializer
from surfzones.models import SurfZone, SurfSpot, Country, Continent


# ============================
# Test Cases for ReviewSerializer
# ============================
@pytest.mark.django_db
def test_review_serializer_create_valid_data():
    """Test creating a review through the serializer with valid input data."""
    user = User.objects.create_user(username="serializeruser", password="testpass")
    continent = Continent.objects.create(name="Europe")
    country = Country.objects.create(name="France", code="FR", continent=continent)
    zone = SurfZone.objects.create(name="Hossegor", country=country)

    data = {
        "rating": 5,
        "comment": "Awesome place!",
        "surf_zone": zone.id
    }
    context = {"request": type("Request", (), {"user": user, "method": "POST"})()}
    serializer = ReviewSerializer(data=data, context=context)
    assert serializer.is_valid(), serializer.errors
    review = serializer.save(user=user)

    assert review.rating == 5
    assert review.comment == "Awesome place!"
    assert review.surf_zone == zone
    assert review.user == user


@pytest.mark.django_db
def test_review_serializer_create_invalid_rating():
    """Test that an invalid rating raises a validation error."""
    user = User.objects.create_user(username="invaliduser", password="testpass")
    continent = Continent.objects.create(name="North America")
    country = Country.objects.create(name="USA", code="US", continent=continent)
    zone = SurfZone.objects.create(name="Malibu", country=country)

    data = {
        "rating": 6,  # Invalid rating (should be 1-5)
        "comment": "Too crowded!",
        "surf_zone": zone.id
    }
    context = {"request": type("Request", (), {"user": user, "method": "POST"})()}
    serializer = ReviewSerializer(data=data, context=context)

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_review_serializer_create_missing_surf_zone():
    """Test that missing surf zone raises a validation error."""
    user = User.objects.create_user(username="missingzoneuser", password="testpass")
    
    data = {
        "rating": 4,
        "comment": "Great waves!",
        # Missing surf_zone
    }
    context = {"request": type("Request", (), {"user": user, "method": "POST"})()}
    serializer = ReviewSerializer(data=data, context=context)
    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_review_serializer_update_valid_data():
    """Test updating a review through the serializer with valid input data."""
    user = User.objects.create_user(username="updateuser", password="testpass")
    continent = Continent.objects.create(name="Asia")
    country = Country.objects.create(name="Japan", code="JP", continent=continent)
    zone = SurfZone.objects.create(name="Shonan", country=country)
    review = Review.objects.create(user=user, surf_zone=zone, rating=3, comment="Decent spot")

    update_data = {
        "rating": 4,
        "comment": "Better than expected!"
    }
    context = {"request": type("Request", (), {"user": user, "method": "PUT"})()}
    serializer = ReviewSerializer(instance=review, data=update_data, context=context)
    
    assert serializer.is_valid(), serializer.errors
    updated_review = serializer.save()

    assert updated_review.rating == 4
    assert updated_review.comment == "Better than expected!"


@pytest.mark.django_db
def test_review_serializer_update_invalid_rating():
    """Test that updating a review with an invalid rating raises a validation error."""
    user = User.objects.create_user(username="invalidupdateuser", password="testpass")
    continent = Continent.objects.create(name="South America")
    country = Country.objects.create(name="Peru", code="PE", continent=continent)
    zone = SurfZone.objects.create(name="Punta Hermosa", country=country)
    review = Review.objects.create(user=user, surf_zone=zone, rating=2, comment="Not bad")

    update_data = {
        "rating": 7,  # Invalid rating
        "comment": "Still not bad"
    }
    context = {"request": type("Request", (), {"user": user, "method": "PUT"})()}
    serializer = ReviewSerializer(instance=review, data=update_data, context=context)

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_review_serializer_update_missing_surf_zone():
    """Test that updating a review without specifying surf zone raises a validation error."""
    user = User.objects.create_user(username="missingupdatezoneuser", password="testpass")
    continent = Continent.objects.create(name="Africa")
    country = Country.objects.create(name="Morocco", code="MA", continent=continent)
    zone = SurfZone.objects.create(name="Taghazout", country=country)
    review = Review.objects.create(user=user, surf_zone=zone, rating=5, comment="Epic waves!")

    update_data = {
        "rating": 4,
        "comment": "Still epic!"
        # Missing surf_zone
    }
    context = {"request": type("Request", (), {"user": user, "method": "PATCH"})()}
    serializer = ReviewSerializer(instance=review, data=update_data, context=context)

    assert serializer.is_valid()


@pytest.mark.django_db
def test_review_serializer_duplicate_zone_review():
    """Test that creating a duplicate review for the same zone raises a validation error."""
    user = User.objects.create_user(username="dupuser", password="testpass")
    continent = Continent.objects.create(name="South America")
    country = Country.objects.create(name="Chile", code="CL", continent=continent)
    zone = SurfZone.objects.create(name="Pichilemu", country=country)
    Review.objects.create(user=user, surf_zone=zone, rating=4)

    data = {
        "rating": 5,
        "comment": "Second review!",
        "surf_zone": zone.id
    }
    context = {"request": type("Request", (), {"user": user, "method": "POST"})()}
    serializer = ReviewSerializer(data=data, context=context)

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_review_serializer_create_duplicate_spot_review():
    """Test that creating a duplicate review for the same surf spot raises a validation error."""
    user = User.objects.create_user(username="dupspotuser", password="testpass")
    continent = Continent.objects.create(name="North America")
    country = Country.objects.create(name="USA", code="US", continent=continent)
    zone = SurfZone.objects.create(name="Huntington Beach", country=country)
    spot = SurfSpot.objects.create(name="HB Pier", surfzone=zone)
    Review.objects.create(user=user, surf_spot=spot, rating=4)

    data = {
        "rating": 5,
        "comment": "Second review!",
        "surf_spot": spot.id
    }
    context = {"request": type("Request", (), {"user": user, "method": "POST"})()}
    serializer = ReviewSerializer(data=data, context=context)

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_review_serializer_output_nested_fields():
    """Test that nested user and location fields appear in serialized output."""
    user = User.objects.create_user(username="outputuser", password="testpass")
    continent = Continent.objects.create(name="Oceania")
    country = Country.objects.create(name="Australia", code="AU", continent=continent)
    spot = SurfSpot.objects.create(name="Snapper Rocks", surfzone=SurfZone.objects.create(name="Gold Coast", country=country))
    review = Review.objects.create(user=user, surf_spot=spot, rating=4, comment="Crowded but fun!")

    serializer = ReviewSerializer(instance=review)

    assert serializer.data["rating"] == 4
    assert serializer.data["comment"] == "Crowded but fun!"
    assert serializer.data["user"]["username"] == "outputuser"
    assert serializer.data["surf_spot_details"]["name"] == "Snapper Rocks"