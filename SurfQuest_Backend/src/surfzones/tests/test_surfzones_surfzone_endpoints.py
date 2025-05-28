"""
Tests for SurfZone API endpoints.

This module verifies authentication and CRUD behavior for the
/api/v1/surfzones/ endpoints using Django REST Framework's APIClient.
Only GET operations are allowed according to the viewset.
"""

# ============================
# Python Standard Library Imports
# ============================

# ============================
# Third-Party Imports
# ============================
import pytest
from rest_framework import status
from rest_framework.test import APIClient

# ============================
# Local Application Imports
# ============================
from users.models import User
from surfzones.models import Continent, Country, SurfZone


# ============================
# Test Cases
# ============================
@pytest.mark.django_db
def test_list_surfzones_authenticated():
    """Test that an authenticated user can list surf zones."""
    user = User.objects.create_user(username="zoneuser", password="StrongPassword123!")
    continent = Continent.objects.create(name="Europe")
    country = Country.objects.create(name="France", code="FR", continent=continent)
    SurfZone.objects.create(name="Hossegor", country=country)

    client = APIClient()
    login = client.post("/api/login/", {"username": "zoneuser", "password": "StrongPassword123!"})
    token = login.data["access"]  # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get("/api/v1/surfzones/")
    assert response.status_code == status.HTTP_200_OK # type: ignore
    assert len(response.data) == 1  # type: ignore

@pytest.mark.django_db
def test_retrieve_single_surfzone_authenticated():
    """Test that an authenticated user can retrieve a specific surf zone."""
    user = User.objects.create_user(username="zoneuser", password="StrongPassword123!")
    continent = Continent.objects.create(name="Europe")
    country = Country.objects.create(name="France", code="FR", continent=continent)
    zone = SurfZone.objects.create(name="Hossegor", country=country)

    client = APIClient()
    login = client.post("/api/login/", {"username": "zoneuser", "password": "StrongPassword123!"})
    token = login.data["access"]  # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get(f"/api/v1/surfzones/{zone.id}/")
    assert response.status_code == status.HTTP_200_OK # type: ignore
    assert response.data["name"] == "Hossegor"  # type: ignore

@pytest.mark.django_db
def test_list_surfzones_unauthenticated():
    """Test that unauthenticated users cannot access the surfzones endpoint."""
    response = APIClient().get("/api/v1/surfzones/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED # type: ignore

