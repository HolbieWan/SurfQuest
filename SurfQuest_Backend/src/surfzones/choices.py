"""
Choice definitions for select fields in the SurfQuest project.

These enums are used to provide consistent options across models and forms
for traveler types, surf levels, wind/tide directions, months, and more.
"""

# ============================
# Django Core
# ============================
from django.db import models


# ============================
# Choice Classes
# ============================
class TRAVELER_TYPE_CHOICES(models.TextChoices):
    """
    Traveler profile types used for trip filtering and user preferences.
    """
    SOLO = 'Solo', 'Solo'
    COUPLE = 'Couple', 'Couple'
    FAMILY = 'Family', 'Family'
    GROUP = 'Group', 'Group'

class CONFORT_CHOICES(models.TextChoices):
    """
    Accommodation comfort level preferences.
    """
    SIMPLE = 'Simple', 'Simple'
    CONFORTABLE = 'Comfortable', 'Comfortable'
    PREMIUM = 'Premium', 'Premium'

class SAFETY_CHOICES(models.TextChoices):
    """
    Perceived safety level of a destination.
    """
    LOW = 'Low', 'Low'
    MODERATE = 'Moderate', 'Moderate'
    HIGH = 'High', 'High'

class COST_CHOICES(models.TextChoices):
    """
    Cost level of a destination (e.g., food, lodging, transport).
    """
    CHEAP = 'Cheap', 'Cheap'
    MODERATE = 'Moderate', 'Moderate'
    EXPENSIVE = 'Expensive', 'Expensive'

class SURF_WIND_DIRECTION_CHOICES(models.TextChoices):
    """
    Wind direction classifications for surf conditions.
    Used for analyzing surfability and wind exposure.
    """
    N = 'N', 'North'
    NNE = 'N-NE', 'North-northeast'
    NE = 'NE', 'Northeast'
    ENE = 'E-NE', 'East-northeast'
    E = 'E', 'East'
    ESE = 'E-SE', 'East-southeast'
    SE = 'SE', 'Southeast'
    SSE = 'S-SE', 'South-southeast'
    S = 'S', 'South'
    SSW = 'S-SW', 'South-southwest'
    SW = 'SW', 'Southwest'
    WSW = 'W-SW', 'West-southwest'
    W = 'W', 'West'
    WNW = 'W-NW', 'West-northwest'
    NW = 'NW', 'Northwest'
    NNW = 'N-NW', 'North-northwest'

class SURF_LEVEL_CHOICES(models.TextChoices):
    """
    Surf experience levels for matching users with suitable spots.
    """
    BEGINNER = 'Beginner', 'Beginner'
    INTERMEDIATE = 'Intermediate', 'Intermediate'
    ADVANCED = 'Advanced', 'Advanced'
    PRO = 'Pro', 'Pro'

class BEST_TIDE_CHOICES(models.TextChoices):
    """
    Tide level for surf conditions at a spot.
    """
    LOW = 'Low', 'Low'
    MID = 'Mid', 'Mid'
    HIGH = 'High', 'High'

class WAVE_DIRECTION_CHOICES(models.TextChoices):
    """
    Typical breaking direction of waves at a surf spot.
    """
    LEFT = 'Left', 'Left'
    RIGHT = 'Right', 'Right'
    LEFT_AND_RIGHT = 'Left and right', 'Left and right'

class BREAK_TYPE_CHOICES(models.TextChoices):
    """
    Type of wave break at a surf spot, based on underwater terrain.
    """
    BEACH_BREAK = 'Beach break', 'Beach break' 
    REEF_BREAK = 'Reef break', 'Reef break' 
    POINT_BREAK = 'Point break', 'Point break'
    RIVERMOUTH = 'River-mouth', 'River-mouth'
    SLAB = 'Slab', 'Slab'

class MONTHS_CHOICES(models.TextChoices):
    """
    Month names used for surf condition planning and seasonal data.
    """
    JANUARY = 'January', 'January'
    FEBRUARY = 'February', 'February'
    MARCH = 'March', 'March'
    APRIL = 'April', 'April'
    MAY = 'May', 'May'
    JUNE = 'June', 'June'
    JULY = 'July', 'July'
    AUGUST = 'August', 'August'
    SEPTEMBER = 'September', 'September'
    OCTOBER = 'October', 'October'
    NOVEMBER = 'November', 'November'
    DECEMBER = 'December', 'December'