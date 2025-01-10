from django.db import models
from enum import Enum

class MONTH_CHOICES(models.TextChoices):
    JAN = 'Jan', 'January'
    FEB = 'Feb', 'February'
    MAR = 'Mar', 'March'
    APR = 'Apr', 'April'
    MAY = 'May', 'May'
    JUN = 'Jun', 'June'
    JUL = 'Jul', 'July'
    AUG = 'Aug', 'August'
    SEP = 'Sep', 'September'
    OCT = 'Oct', 'October'
    NOV = 'Nov', 'November'
    DEC = 'Dec', 'December'

class CROWD_CHOICES(models.TextChoices):
    LOW = 'Low', 'Low'
    MEDIUM = 'Medium', 'Medium'
    HIGH = 'High', 'High'
    VERY_HIGH = 'Very High', 'Very High'

class RATING_CHOICES(models.IntegerChoices):
    MEDIOCRE = 1, 'Mediocre'
    FAIR = 2, 'Fair'
    GOOD = 3, 'Good'
    VERY_GOOD = 4, 'Very good'
    EXCELLENT = 5, 'Excellent'

class SURF_WIND_DIRECTION_CHOICES(models.TextChoices):
    N = 'N', 'North'
    NE = 'NE', 'Northeast'
    E = 'E', 'East'
    SE = 'SE', 'Southeast'
    S = 'S', 'South'
    SW = 'SW', 'Southwest'
    W = 'W', 'West'
    NW = 'NW', 'Northwest'