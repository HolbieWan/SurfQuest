from django.db import models
from enum import Enum


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