from django.db import models

class TRAVELER_TYPE_CHOICES(models.TextChoices):
    SOLO = 'Solo', 'Solo'
    COUPLE = 'Couple', 'Couple'
    FAMILY = 'Family', 'Family'
    GROUP = 'Group', 'Group'

class CONFORT_CHOICES(models.TextChoices):
    SIMPLE = 'Simple', 'Simple'
    CONFORTABLE = 'Confortable', 'Confortable'
    PREMIUM = 'Premium', 'Premium'

class COST_CHOICES(models.TextChoices):
    CHEAP = 'Cheap', 'Cheap'
    MODERATE = 'Moderate', 'Moderate'
    EXPENSIVE = 'Expensive', 'Expensive'

class SURF_WIND_DIRECTION_CHOICES(models.TextChoices):
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
    BEGINNER = 'beginner', 'Beginner'
    INTERMEDIATE = 'intermediate', 'Intermediate'
    ADVANCED = 'advanced', 'Advanced'
    PRO = 'pro', 'Pro'

class BEST_TIDE_CHOICES(models.TextChoices):
    LOW = 'low', 'Low'
    MID = 'mid', 'Mid'
    HIGH = 'high', 'High'

class MAIN_WAVE_DIRECTION_CHOICES(models.TextChoices):
    LEFT = 'left', 'Left'
    RIGHT = 'right', 'Right'
    LEFT_AND_RIGHT = 'left_and_right', 'Left and Right'