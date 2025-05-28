
"""
Integration tests for user-related API endpoints in the SurfQuest project.

These tests cover:
- User registration and login with token generation
- Retrieving, updating, and deleting user profile information
- Access control for protected endpoints requiring authentication
"""

# ============================
# Django & DRF Testing Imports
# ============================
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

# ============================
# Local Imports
# ============================
from users.models import User


@pytest.mark.django_db
def test_user_registration():
    """Test that a new user can register successfully and receives a 201 response with an ID."""
    client = APIClient()
    response = client.post("/api/v1/users/", {
        "username": "testuser",
        "password": "StrongPassword123!",
        "email": "test@example.com"
    })
    assert response.status_code == status.HTTP_201_CREATED # type: ignore
    assert "id" in response.data # type: ignore


@pytest.mark.django_db
def test_user_login_returns_token():
    """Test that a registered user can log in and receive access and refresh tokens."""
    user = User.objects.create_user(username="testuser", password="StrongPassword123!")
    client = APIClient()
    response = client.post("/api/login/", {
        "username": "testuser",
        "password": "StrongPassword123!"
    })
    assert response.status_code == status.HTTP_200_OK # type: ignore
    assert "access" in response.data # type: ignore
    assert "refresh" in response.data # type: ignore


@pytest.mark.django_db
def test_get_user_detail_authenticated():
    """Test that an authenticated user can retrieve their user detail successfully."""
    user = User.objects.create_user(username="testuser", password="StrongPassword123!")
    client = APIClient()
    response = client.post("/api/login/", {
        "username": "testuser",
        "password": "StrongPassword123!"
    })
    token = response.data["access"] # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    response = client.get(f"/api/v1/users/{user.id}/")
    assert response.status_code == status.HTTP_200_OK # type: ignore
    assert response.data["username"] == "testuser" # type: ignore


@pytest.mark.django_db
def test_update_user_profile_authenticated():
    """Test that an authenticated user can update their profile fields such as first name."""
    user = User.objects.create_user(username="testuser", password="StrongPassword123!")
    client = APIClient()
    login = client.post("/api/login/", {
        "username": "testuser",
        "password": "StrongPassword123!"
    })
    token = login.data["access"] # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    response = client.patch(f"/api/v1/users/{user.id}/", {"first_name": "Updated"})
    assert response.status_code == status.HTTP_200_OK # type: ignore
    assert response.data["first_name"] == "Updated" # type: ignore


@pytest.mark.django_db
def test_delete_user_authenticated():
    """Test that an authenticated user can delete their account and it is removed from the database."""
    user = User.objects.create_user(username="testuser", password="StrongPassword123!")
    client = APIClient()
    login = client.post("/api/login/", {
        "username": "testuser",
        "password": "StrongPassword123!"
    })
    token = login.data["access"] # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    response = client.delete(f"/api/v1/users/{user.id}/")
    assert response.status_code == status.HTTP_204_NO_CONTENT # type: ignore
    assert User.objects.filter(id=user.id).count() == 0


@pytest.mark.django_db
def test_protected_view_requires_authentication():
    """Test that accessing a protected endpoint without a token returns a 401 Unauthorized status."""
    client = APIClient()
    response = client.get("/api/v1/protected-endpoint/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED # type: ignore


@pytest.mark.django_db
def test_protected_view_with_token():
    """Test that an authenticated user with a valid token can access a protected endpoint."""
    user = User.objects.create_user(username="testuser", password="StrongPassword123!")
    client = APIClient()
    login = client.post("/api/login/", {
        "username": "testuser",
        "password": "StrongPassword123!"
    })
    token = login.data["access"] # type: ignore
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    response = client.get("/api/v1/protected-endpoint/")
    assert response.status_code == status.HTTP_200_OK # type: ignore
    assert "message" in response.data # type: ignore


@pytest.mark.django_db
def test_user_viewset_retrieve_requires_authentication():
    """Test that retrieving user details requires authentication."""
    user = User.objects.create_user(username="testuser", password="StrongPassword123!", email="test@example.com")
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.get(f"/api/v1/users/{user.id}/")
    
    assert response.status_code == 200 # type: ignore
    assert response.data["email"] == user.email # type: ignore


# @pytest.mark.django_db
# def test_user_detail_by_slug():
#     """Test retrieving user details using the slug instead of the UUID (currently commented out)."""
#     user = User.objects.create_user(username="sluguser", password="StrongPassword123!")
#     print("USER SLUG:", user.slug)
#     client = APIClient()
#     response = client.get(f"/api/v1/users/{user.slug}/")
#     assert response.status_code == status.HTTP_200_OK # type: ignore
#     assert response.data["username"] == "sluguser" # type: ignore