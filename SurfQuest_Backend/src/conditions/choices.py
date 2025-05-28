"""
Choice enumerations used for the Condition model in the SurfQuest project.

Defines dropdown options for crowd levels and surf ratings.
"""

# ============================
# Django Core
# ============================
from django.db import models   # Used for TextChoices and IntegerChoices

# ============================
# Python Standard Library
# ============================
from enum import Enum # (Imported for potential future use, not currently needed)


class CROWD_CHOICES(models.TextChoices):
    """
    Crowd density levels at surf spots.

    Used to describe how busy a surf spot typically is,
    helping users choose between peaceful or popular destinations.
    """
    LOW = 'Low', 'Low'
    MEDIUM = 'Medium', 'Medium'
    HIGH = 'High', 'High'
    VERY_HIGH = 'Very High', 'Very High'

class RATING_CHOICES(models.IntegerChoices):
    """
    Quality rating scale for surf experiences or locations.

    Used for user reviews or internal assessments of surf zones or spots,
    ranging from Mediocre (1) to Excellent (5).
    """
    MEDIOCRE = 1, 'Mediocre'
    FAIR = 2, 'Fair'
    GOOD = 3, 'Good'
    VERY_GOOD = 4, 'Very good'
    EXCELLENT = 5, 'Excellent'