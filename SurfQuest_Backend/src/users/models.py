"""
Models for user profiles and user-generated reviews in the SurfQuest project.

Includes:
- Custom User model extending Django's AbstractUser, with additional profile and location fields.
- Review model for surf zones and surf spots with rating and comment support.
"""

# ============================
# Standard Library
# ============================
import uuid    # Used for generating unique user and review IDs

# ============================
# Django Core Models Utilities
# ============================
from django.db import models   # Base classes for all model definitions
from django.conf import settings   # Access project settings (e.g., custom user model)
from django.utils.text import slugify   # Used to generate slugs from usernames
from django.urls import reverse   # Used to generate absolute URLs for model instances

# ============================
# Django built-in user model extension
# ============================
from django.contrib.auth.models import AbstractUser   # Base class for custom user models


# ============================
# Models
# ============================
class User(AbstractUser):
    """
    Custom user model extending Django's built-in AbstractUser.

    Adds support for location info, avatar, preferences, budget, and slug.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)   # Email is optional but must be unique
    country = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    latitude = models.FloatField(max_length=10, null=True, blank=True)   # Optional geolocation
    longitude = models.FloatField(max_length=10, null=True, blank=True)
    nearest_airport = models.CharField(max_length=100, null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)   # User profile image
    bio = models.TextField(max_length=500, blank=True)
    preferences = models.JSONField(null=True, blank=True)   # Stores user surfing preferences
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)   # User's trip budget
    slug = models.SlugField(max_length=150, blank=True, unique=True)   # For friendly URLs

    def __str__(self):
        """Display the username in admin and logs."""
        return self.username
    
    def save(self, *args, **kwargs):
        """Auto-generate slug from username if not set."""
        if not self.slug:
            self.slug = slugify(self.username)
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['username']

    def get_absolute_url(self):
        """Return the absolute URL for a user profile (used in templates or redirects)."""
        return reverse("blog-post", kwargs={"slug": self.slug})


class Review(models.Model):
    """
    Represents a review submitted by a user for either a surf zone or a surf spot.

    Only one review per user per zone or spot is allowed.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    surf_zone = models.ForeignKey('surfzones.SurfZone', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    surf_spot = models.ForeignKey('surfzones.SurfSpot', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])   # Rating from 1 to 5
    comment = models.TextField(max_length=2000, blank=True)   # Optional user comment
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Readable representation of a review in admin and logs."""
        return f"Review by {self.user.username} - Rating: {self.rating}"
    
    class Meta:
        # Constraints to ensure a user can only review a zone or a spot once
        unique_together = ('user', 'surf_zone')  # Ensures only 1 review per user per surf zone
        unique_together = ('user', 'surf_spot')  # Ensures only 1 review per user per surf spot
