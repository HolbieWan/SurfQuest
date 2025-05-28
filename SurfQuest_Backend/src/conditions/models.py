"""
Model definitions for surf condition data in the SurfQuest project.

This file defines the Condition model, which stores monthly surf and weather conditions
for each surf zone, including swell size, water temperature, wind, and user ratings.
"""

# ============================
# Standard Library
# ============================
import uuid  # Used to generate unique IDs

# ============================
# Django Core Models Utilities
# ============================
from django.db import models   # Base classes for all model definitions
from django.utils.text import slugify   # Used to generate slugs from surf zone names and months
from django.core.validators import MinValueValidator, MaxValueValidator   # Ensures field values are within specified ranges
from django.contrib.postgres.fields import ArrayField   # Enables storing lists in PostgreSQL

# ============================
# Local Application Imports
# ============================
from surfzones.models import SurfZone   # Importing SurfZone model to create foreign key relationship
from .choices import CROWD_CHOICES, RATING_CHOICES   # Local rating and crowd level choices
from surfzones.choices import (  # Reuse shared surf-related choices
    SURF_WIND_DIRECTION_CHOICES,
    MONTHS_CHOICES,
    SURF_LEVEL_CHOICES,
)


# ============================
# Models
# ============================
class Condition(models.Model):
    """
    Represents monthly surf and weather conditions for a given surf zone.

    This includes swell data, temperatures, ratings, and wind statistics.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    surfzone = models.ForeignKey(SurfZone, on_delete=models.PROTECT, related_name='conditions')   # Link to SurfZone
    month = models.CharField(max_length=12, choices=MONTHS_CHOICES.choices)
    water_temp_c = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(30)], null=True, blank=True)
    water_temp_f = models.IntegerField(validators=[MinValueValidator(32), MaxValueValidator(86)], null=True, blank=True)
    swell_size_ft = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], null=True, blank=True)
    swell_size_meter = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(30.0)], null=True, blank=True)
    swell_consistency = models.IntegerField(null=True, blank=True)   # % of days with surfable swell
    swell_direction = models.CharField(max_length=10, choices=SURF_WIND_DIRECTION_CHOICES.choices, blank=True)
    surf_level = ArrayField(base_field=models.CharField(max_length=20, choices=SURF_LEVEL_CHOICES.choices), blank=True, default=list)
    crowd = models.CharField(max_length=10, choices=CROWD_CHOICES.choices, blank=True)
    local_surf_rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES.choices, validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, default=3)   # Rating from local surfers
    world_surf_rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES.choices, validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, default=3)   # Rating from global surfers
    min_air_temp_c = models.IntegerField(validators=[MinValueValidator(-100), MaxValueValidator(100)], null=True, blank=True)
    min_air_temp_f = models.IntegerField(validators=[MinValueValidator(-148), MaxValueValidator(212)], null=True, blank=True)
    max_air_temp_c = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    max_air_temp_f = models.IntegerField(validators=[MinValueValidator(32), MaxValueValidator(212)], null=True, blank=True)
    rain_quantity = models.IntegerField(null=True, blank=True)   # Total rain in mm for the month
    rain_days = models.IntegerField(null=True, blank=True)
    sunny_days = models.IntegerField(null=True, blank=True)
    wind_force = models.IntegerField( validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, null=True)
    wind_direction = models.CharField(max_length=10, choices=SURF_WIND_DIRECTION_CHOICES.choices, blank=True)
    wind_consistency = models.IntegerField(null=True, blank=True)   # % of days with consistent wind
    slug = models.SlugField(max_length=150, blank=True, unique=True)   # Slug for SEO/friendly URLs

    def save(self, *args, **kwargs):
        """Automatically generate a slug from surf zone name and month if not set."""
        if not self.slug:
            self.slug = slugify(f"{self.surfzone.name}-{self.month}")
        super().save(*args, **kwargs)

    def __str__(self):
        """Return a string representation of the condition."""
        return f"Conditions for {self.surfzone.name} in {self.month}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['surfzone', 'month'], name='unique_conditions_surfzone_month')   # Ensure one condition per surf zone per month
        ]
        ordering = ['surfzone', 'month']   # Order by surf zone and month for easier querying