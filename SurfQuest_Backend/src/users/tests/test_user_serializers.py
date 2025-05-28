

"""
Unit tests for the UserSerializer in the SurfQuest project.

These tests ensure that user data is properly validated, password is hashed,
and fields are correctly serialized and deserialized.
"""

# ============================
# Django & DRF Testing Imports
# ============================
import pytest
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import check_password

# ============================
# Local Application Imports
# ============================
from users.serializers import UserSerializer
from users.models import User


@pytest.mark.django_db
def test_user_serializer_valid_data():
    """Test serializer with valid user data."""
    data = {
        "username": "testuser",
        "password": "StrongPassw0rd!",
        "email": "test@example.com",
    }
    serializer = UserSerializer(data=data)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_user_serializer_password_hashing():
    """Test that password is hashed during user creation."""
    data = {
        "username": "secureuser",
        "password": "Secure1234!",
        "email": "secure@example.com"
    }
    serializer = UserSerializer(data=data)
    assert serializer.is_valid()
    user = serializer.save()

    # Ensure password is not stored in plain text
    assert user.password != data["password"]
    assert check_password(data["password"], user.password)


@pytest.mark.django_db
def test_user_serializer_invalid_password():
    """Test that weak passwords are rejected by validation."""
    data = {
        "username": "weakuser",
        "password": "123",
        "email": "weak@example.com"
    }
    serializer = UserSerializer(data=data)
    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)


@pytest.mark.django_db
def test_user_serializer_update_user():
    """Test updating user data through serializer, including password update."""
    user = User.objects.create_user(
        username="updateuser",
        email="update@example.com",
        password="OldPassword123"
    )
    update_data = {
        "first_name": "Updated",
        "password": "NewSecure123!"
    }
    serializer = UserSerializer(instance=user, data=update_data, partial=True)
    assert serializer.is_valid()
    updated_user = serializer.save()

    # Password should be updated and hashed
    assert check_password("NewSecure123!", updated_user.password)
    assert updated_user.first_name == "Updated"