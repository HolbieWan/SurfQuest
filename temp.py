import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    country = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    latitude = models.FloatField(max_length=10, null=True, blank=True)
    longitude = models.FloatField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.username


class Continent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=2, unique=True)  # ISO 3166-1 alpha-2 code

    def __str__(self):
        return self.name


class Country(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3, unique=True)  # ISO 3166-1 alpha-3 code
    continent = models.ForeignKey(Continent, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class SurfZone(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    nearest_city = models.CharField(max_length=100)
    nearest_airport = models.CharField(max_length=100)
    latitude = models.FloatField(max_length=10, null=True, blank=True)
    longitude = models.FloatField(max_length=10, null=True, blank=True)
    solo = models.BooleanField(default=False)
    couple = models.BooleanField(default=False)
    family = models.BooleanField(default=False)
    safety = models.CharField(max_length=100, null=True, blank=True)
    health = models.CharField(max_length=100, null=True, blank=True)
    confort = models.CharField(max_length=100, null=True, blank=True)
    cost = models.CharField(max_length=100, null=True, blank=True)
    language = models.CharField(max_length=100, null=True, blank=True)
    currency = models.CharField(max_length=100, null=True, blank=True)
    religion = models.CharField(max_length=100, null=True, blank=True)
    surroundings = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    surf_spots = models.ForeignKey('SurfSpot', on_delete=models.CASCADE)
    lefts = models.BooleanField(default=False)
    rights = models.BooleanField(default=False)
    left_and_rights = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class SurfSpot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    surfzone = models.ForeignKey(SurfZone, on_delete=models.CASCADE, related_name='surf_spots')
    latitude = models.FloatField(max_length=10)
    longitude = models.FloatField(max_length=10)
    break_type = models.CharField(max_length=100)
    left = models.BooleanField(default=False)
    right = models.BooleanField(default=False)
    left_and_right = models.BooleanField(default=False)
    best_wind = models.CharField(max_length=100)
    best_swell_direction = models.CharField(max_length=100)
    best_swell_size = models.FloatField(max_length=10)
    best_tide = models.CharField(max_length=100)
    surf_level = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class SurfZoneImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    surfzone = models.ForeignKey(SurfZone, on_delete=models.CASCADE, related_name='zone_images')
    image = models.ImageField(upload_to='surfzones/')
    description = models.TextField(null=True, blank=True)
    slug = models.SlugField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Image for {self.surfzone.name}"


class SurfSpotImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    surf_spot = models.ForeignKey(SurfSpot, on_delete=models.CASCADE, related_name='spot_images')
    image = models.ImageField(upload_to='surfspots/')
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Image for {self.surf_spot.name}"


class Conditions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    surfzone = models.ForeignKey(SurfZone, on_delete=models.CASCADE, related_name='conditions')
    month = models.CharField(max_length=100)
    water_temp = models.IntegerField(max_length=10)
    swell_size = models.FloatField(max_length=10)
    swell_consistancy = models.IntegerField(max_length=10)
    swell_direction = models.CharField(max_length=100)
    beginers = models.BooleanField(default=False)
    intermediate = models.BooleanField(default=False)
    advanced = models.BooleanField(default=False)
    pro = models.BooleanField(default=False)
    crowds = models.CharField(max_length=100)
    local_surf_quality = models.CharField(max_length=100)
    global_surf_rating = models.CharField(max_length=100)
    min_air_temp = models.IntegerField(max_length=10)
    max_air_temp = models.IntegerField(max_length=10)
    rain_quantity = models.IntegerField(max_length=10)
    rain_days = models.IntegerField(max_length=10)
    wind_force = models.IntegerField(max_length=10)
    wind_direction = models.CharField(max_length=100)
    wind_consistency = models.IntegerField(max_length=10)

    def __str__(self):
        return f"Conditions for {self.surfzone.name} on {self.month}"