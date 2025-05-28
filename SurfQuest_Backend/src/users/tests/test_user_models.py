"""
Unit tests for the custom User model in the SurfQuest project.

These tests validate:
- String representation (__str__)
- Slug auto-generation on save
- Unique constraint on the email field
- Defaults for optional fields
- Absolute URL generation via get_absolute_url()
"""

# ============================
# Standard Library
# ============================
from django.urls import reverse  # Used for testing URL generation

# ============================
# Django Testing Framework
# ============================
import pytest  # Pytest for testing framework

# ============================
# Local Imports
# ============================
from users.models import User  # Importing the User model to test


@pytest.mark.django_db
def test_user_str_representation():
    """Test that __str__ returns the username."""
    user = User(username="surfer123")
    assert str(user) == "surfer123"


@pytest.mark.django_db
def test_user_slug_generation_on_save():
    """Test that slug is automatically generated on save from username."""
    user = User(username="SurferTest")
    user.save()
    assert user.slug == "surfertest"   # Slug should be lowercase and URL-friendly


@pytest.mark.django_db
def test_user_email_field_unique():
    """Test that email field enforces uniqueness."""
    User.objects.create_user(username="user1", email="unique@example.com", password="password")
    with pytest.raises(Exception):
        User.objects.create_user(username="user2", email="unique@example.com", password="password")


@pytest.mark.django_db
def test_user_optional_fields_defaults():
    """Test default values for optional user fields."""
    user = User(username="surfer", email="surfer@example.com")
    user.save()
    assert not user.avatar 
    assert user.bio == ""
    assert user.preferences is None
    assert user.budget is None


@pytest.mark.django_db
def test_get_absolute_url():
    """Test that get_absolute_url returns the correct profile URL."""
    user = User(username="urluser")
    user.save()
    assert user.get_absolute_url() == f"/api/v1/users/{user.slug}/"


@pytest.mark.django_db
def test_user_full_field_save():
    """Test that all fields can be saved correctly."""
    user = User.objects.create_user(
        username="fulluser",
        email="full@example.com",
        password="password",
        bio="Surf lover",
        budget=2500.00,
        latitude=45.0,
        longitude=-1.2,
        nearest_airport="Bordeaux",
    )
    assert user.bio == "Surf lover"
    assert user.budget == 2500.00
    assert user.latitude == 45.0
    assert user.longitude == -1.2
    assert user.nearest_airport == "Bordeaux"


@pytest.mark.django_db
def test_user_preserves_manual_slug():
    """Test that a manually set slug is preserved and not overwritten."""
    user = User(username="manual", slug="custom-slug")
    user.save()
    assert user.slug == "custom-slug"


@pytest.mark.django_db
def test_user_avatar_upload(tmpdir):
    """Test that avatar can be uploaded and saved correctly."""
    from django.core.files.uploadedfile import SimpleUploadedFile

    avatar_path = tmpdir.join("avatar.png")   # Create a temporary file for the avatar
    avatar_path.write("fake image content")   # Write fake content to the file

    with avatar_path.open("rb") as img_file:   # Open the file in binary mode
        user = User.objects.create_user(   # Create a user with an avatar
            username="avataruser",
            email="avatar@example.com",
            password="password",
            avatar=SimpleUploadedFile("avatar.png", img_file.read(), content_type="image/png")
        )

    assert user.avatar.name.startswith("avatars/avatar")   # Check if the avatar is saved in the correct directory
