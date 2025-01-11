from django.db import models

class TRAVELER_TYPE_CHOICES(models.TextChoices):
    SOLO = 'Solo', 'Solo'
    COUPLE = 'Couple', 'Couple'
    FAMILY = 'Family', 'Family'
    GROUP = 'Group', 'Group'

class CONFORT_CHOICES(models.TextChoices):
    SIMPLE = 'Simple', 'Simple'
    CONFORTABLE = 'Comfortable', 'Comfortable'
    PREMIUM = 'Premium', 'Premium'

class SAFETY_CHOICES(models.TextChoices):
    LOW = 'Low', 'Low'
    MODERATE = 'Moderate', 'Moderate'
    HIGH = 'High', 'High'

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
    BEGINNER = 'Beginner', 'Beginner'
    INTERMEDIATE = 'Intermediate', 'Intermediate'
    ADVANCED = 'Advanced', 'Advanced'
    PRO = 'Pro', 'Pro'

class BEST_TIDE_CHOICES(models.TextChoices):
    LOW = 'Low', 'Low'
    MID = 'Mid', 'Mid'
    HIGH = 'High', 'High'

class WAVE_DIRECTION_CHOICES(models.TextChoices):
    LEFT = 'Left', 'Left'
    RIGHT = 'Right', 'Right'
    LEFT_AND_RIGHT = 'Left_and_right', 'Left and Right'

class MONTHS_CHOICES(models.TextChoices):
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