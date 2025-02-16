import uuid
from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from .choices import CONFORT_CHOICES, COST_CHOICES, SURF_WIND_DIRECTION_CHOICES, SURF_LEVEL_CHOICES, BREAK_TYPE_CHOICES, BEST_TIDE_CHOICES, TRAVELER_TYPE_CHOICES, WAVE_DIRECTION_CHOICES, SAFETY_CHOICES, MONTHS_CHOICES
from django.contrib.postgres.fields import ArrayField
from datetime import datetime
from users.models import User

# Create your models here.
class Continent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=2, unique=True)  # ISO 3166-1 alpha-2 code
    slug = models.SlugField(max_length=150, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'code'], name='unique_continent_name_per_code')
        ]
        ordering = ['name']


class Country(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3, unique=True)  # ISO 3166-1 alpha-3 code
    continent = models.ForeignKey(Continent, on_delete=models.PROTECT)
    slug = models.SlugField(max_length=150, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'continent'], name='unique_country_per_continent')
        ]
        ordering = ['name']


class SurfZone(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)
    nearest_city = models.CharField(max_length=50, blank=True)
    nearest_airport = models.CharField(max_length=50, blank=True)
    airport_latitude = models.FloatField(null=True, blank=True)
    airport_longitude = models.FloatField(null=True, blank=True)
    traveler_type = ArrayField(
        base_field=models.CharField(max_length=20, choices=TRAVELER_TYPE_CHOICES.choices),
        blank=True,
        default=list
    )
    safety = models.CharField(max_length=100,choices=SAFETY_CHOICES.choices ,blank=True)
    health_hazards = ArrayField(models.CharField(max_length=100), blank=True, default=list)
    surf_hazards = ArrayField(models.CharField(max_length=100), blank=True, default=list)
    best_months = ArrayField(base_field=models.CharField(max_length=100, choices=MONTHS_CHOICES.choices), blank=True, default=list)
    confort = models.CharField(max_length=20, choices=CONFORT_CHOICES.choices, blank=True)
    cost = models.CharField(max_length=10, choices=COST_CHOICES.choices, blank=True)
    language = models.CharField(max_length=100, blank=True)
    currency = models.CharField(max_length=100, blank=True)
    religion = models.CharField(max_length=100, blank=True)
    surroundings = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    main_wave_direction = models.CharField(max_length=20, choices=WAVE_DIRECTION_CHOICES.choices, blank=True)
    slug = models.SlugField(max_length=150, blank=True, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'country'], name='unique_surf_zone_for_country')
        ]
        ordering = ['name']


class SurfSpot(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    surfzone = models.ForeignKey(SurfZone, on_delete=models.PROTECT, related_name='surf_spots')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    break_type = models.CharField(max_length=20, choices=BREAK_TYPE_CHOICES, blank=True)
    wave_direction = models.CharField(max_length=20, choices=WAVE_DIRECTION_CHOICES.choices, blank=True)
    best_wind_direction = models.CharField(max_length=5, choices=SURF_WIND_DIRECTION_CHOICES.choices, blank=True)
    best_swell_direction = models.CharField(max_length=5, choices=SURF_WIND_DIRECTION_CHOICES.choices, blank=True)
    best_swell_size_feet = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], blank=True, null=True)
    best_swell_size_meter = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], blank=True, null=True)
    best_tide = ArrayField(base_field=models.CharField(max_length=20, choices=BEST_TIDE_CHOICES.choices), blank=True, default=list)
    surf_level = ArrayField(base_field=models.CharField(max_length=20, choices=SURF_LEVEL_CHOICES.choices), blank=True, default=list)
    surf_hazards = ArrayField(base_field=models.CharField(max_length=100), blank=True, default=list)
    best_months = ArrayField(base_field=models.CharField(max_length=100, choices=MONTHS_CHOICES.choices), blank=True, default=list)
    description = models.TextField(max_length=500, blank=True)
    slug = models.SlugField(max_length=150, blank=True, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class SurfZoneImage(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    surfzone = models.ForeignKey(SurfZone, on_delete=models.PROTECT, related_name='zone_images')
    image = models.ImageField(upload_to='surfzones/surf_zones_images')
    description = models.TextField(blank=True)
    slug = models.SlugField(max_length=150, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            current_time = datetime.now().strftime('%Y%m%d%H%M%S%f')
            self.slug = slugify(f"{self.surfzone.name}-{current_time}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.surfzone.name}"

    class Meta:
        ordering = ['surfzone']

class SurfSpotImage(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    surfspot = models.ForeignKey(SurfSpot, on_delete=models.PROTECT, related_name='spot_images')
    image = models.ImageField(upload_to='surfspots/surf_spots_images')
    description = models.TextField(blank=True)
    slug = models.SlugField(max_length=150, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            current_time = datetime.now().strftime('%Y%m%d%H%M%S%f')
            self.slug = slugify(f"{self.surfspot.name}-{current_time}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Image for {self.surfspot.name}"
    
    class MEta:
        oredering = ['surfspot']
