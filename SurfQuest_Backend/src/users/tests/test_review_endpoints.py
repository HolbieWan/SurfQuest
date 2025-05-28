

"""
Integration tests for Review API endpoints in the SurfQuest project.

These tests cover:
- Review creation and retrieval via public endpoints
- Review management by the authenticated user (user-reviews)
- Authentication enforcement for protected endpoints
"""

# ============================
# Django & DRF Testing Imports
# ============================
import pytest
from rest_framework.test import APIClient
from rest_framework import status

# ============================
# Local Imports
# ============================
from users.models import User, Review
from surfzones.models import Continent, Country, SurfZone


@pytest.mark.django_db
def test_create_review_authenticated_user():
    """Test that an authenticated user can create a review via the /api/v1/reviews/ endpoint."""
    user = User.objects.create_user(username="reviewuser", password="StrongPassword123!")
    continent = Continent.objects.create(name="Europe")
    country = Country.objects.create(name="France", code="FR", continent=continent)
    zone = SurfZone.objects.create(name="Hossegor", country=country)

    client = APIClient()
    login = client.post("/api/login/", {"username": "reviewuser", "password": "StrongPassword123!"})
    token = login.data["access"]  # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.post("/api/v1/reviews/", {
        "surf_zone": str(zone.id),
        "rating": 5,
        "comment": "Perfect waves!"
    })

    assert response.status_code == status.HTTP_201_CREATED  # type: ignore
    assert response.data["rating"] == 5  # type: ignore
    assert response.data["comment"] == "Perfect waves!"  # type: ignore


@pytest.mark.django_db
def test_list_reviews_requires_authentication():
    """Test that listing reviews via /api/v1/reviews/ requires authentication."""
    client = APIClient()
    response = client.get("/api/v1/reviews/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED  # type: ignore


@pytest.mark.django_db
def test_user_reviews_view_only_shows_own_reviews():
    """Test that the /api/v1/user-reviews/ endpoint returns only the authenticated user's reviews."""
    user1 = User.objects.create_user(username="user1", email="user1@example.com", password="StrongPassword123!")
    user2 = User.objects.create_user(username="user2", email="user2@example.com", password="StrongPassword123!")
    continent = Continent.objects.create(name="Oceania")
    country = Country.objects.create(name="Australia", code="AU", continent=continent)
    zone = SurfZone.objects.create(name="Gold Coast", country=country)

    Review.objects.create(user=user1, surf_zone=zone, rating=4, comment="Good surf")
    Review.objects.create(user=user2, surf_zone=zone, rating=3, comment="Too crowded")

    client = APIClient()
    login = client.post("/api/login/", {"username": "user1", "password": "StrongPassword123!"})
    token = login.data["access"]  # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get("/api/v1/user-reviews/")
    assert response.status_code == status.HTTP_200_OK  # type: ignore
    assert len(response.data) == 1  # type: ignore
    assert response.data[0]["comment"] == "Good surf"  # type: ignore


# ============================
# Additional Tests for Permissions
# ============================

@pytest.mark.django_db
def test_user_cannot_update_other_users_review():
    """Test that a user cannot update another user's review via /api/v1/user-reviews/<id>/."""
    user1 = User.objects.create_user(username="owner", email="owner@example.com", password="StrongPassword123!")
    user2 = User.objects.create_user(username="intruder", email="intruder@example.com", password="StrongPassword123!")
    continent = Continent.objects.create(name="Asia")
    country = Country.objects.create(name="Indonesia", code="ID", continent=continent)
    zone = SurfZone.objects.create(name="Bali", country=country)

    review = Review.objects.create(user=user1, surf_zone=zone, rating=5, comment="Amazing waves")

    client = APIClient()
    login = client.post("/api/login/", {"username": "intruder", "password": "StrongPassword123!"})
    token = login.data["access"]  # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.put(f"/api/v1/user-reviews/{review.id}/", {
        "surf_zone": str(zone.id),
        "rating": 1,
        "comment": "Changed by intruder"
    })

    assert response.status_code == status.HTTP_404_NOT_FOUND  # type: ignore


@pytest.mark.django_db
def test_user_cannot_delete_other_users_review():
    """Test that a user cannot delete another user's review via /api/v1/user-reviews/<id>/."""
    user1 = User.objects.create_user(username="owner", email="owner2@example.com", password="StrongPassword123!")
    user2 = User.objects.create_user(username="intruder", email="intruder2@example.com", password="StrongPassword123!")
    continent = Continent.objects.create(name="Africa")
    country = Country.objects.create(name="South Africa", code="ZA", continent=continent)
    zone = SurfZone.objects.create(name="Jeffrey’s Bay", country=country)

    review = Review.objects.create(user=user1, surf_zone=zone, rating=4, comment="Epic point break")

    client = APIClient()
    login = client.post("/api/login/", {"username": "intruder", "password": "StrongPassword123!"})
    token = login.data["access"]  # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.delete(f"/api/v1/user-reviews/{review.id}/")

    assert response.status_code == status.HTTP_404_NOT_FOUND  # type: ignore
    assert Review.objects.filter(id=review.id).exists()
