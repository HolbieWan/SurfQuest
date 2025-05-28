"""
Pytest tests for the surfSpotViewSet endpoints.

These tests verify authentication and access to the surf spot list and detail endpoints.
"""

# ============================
# Django Imports
# ============================
import pytest

# ============================
# Third-Party Imports
# ============================
from rest_framework import status
from rest_framework.test import APIClient

# ============================
# Local Application Imports
# ============================
from users.models import User
from surfzones.models import SurfZone, SurfSpot, Continent, Country


@pytest.mark.django_db
def test_list_surfspots_authenticated():
    """Test that an authenticated user can list all surf spots."""
    user = User.objects.create_user(username="spotuser", password="StrongPassword123!")
    continent = Continent.objects.create(name="Asia")
    country = Country.objects.create(name="Indonesia", code="ID", continent=continent)
    zone = SurfZone.objects.create(name="Bali", country=country)
    SurfSpot.objects.create(name="Uluwatu", surfzone=zone)

    client = APIClient()
    login = client.post("/api/login/", {"username": "spotuser", "password": "StrongPassword123!"})
    token = login.data["access"] # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get("/api/v1/surfspots/")
    assert response.status_code == status.HTTP_200_OK # type: ignore
    assert len(response.data) >= 1 # type: ignore


@pytest.mark.django_db
def test_retrieve_surfspot_authenticated():
    """Test that an authenticated user can retrieve a single surf spot."""
    user = User.objects.create_user(username="spotviewer", password="StrongPassword123!")
    continent = Continent.objects.create(name="Africa")
    country = Country.objects.create(name="Morocco", code="MA", continent=continent)
    zone = SurfZone.objects.create(name="Taghazout", country=country)
    spot = SurfSpot.objects.create(name="Anchor Point", surfzone=zone)

    client = APIClient()
    login = client.post("/api/login/", {"username": "spotviewer", "password": "StrongPassword123!"})
    token = login.data["access"] # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get(f"/api/v1/surfspots/{spot.id}/")
    assert response.status_code == status.HTTP_200_OK # type: ignore
    assert response.data["name"] == "Anchor Point" # type: ignore


@pytest.mark.django_db
def test_list_surfspots_unauthenticated():
    """Test that unauthenticated users cannot access the surf spots list."""
    response = APIClient().get("/api/v1/surfspots/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED # type: ignore
