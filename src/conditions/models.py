import uuid
from django.db import models
from django.utils.text import slugify
from surfzones.models import SurfZone
from django.core.validators import MinValueValidator, MaxValueValidator
from .choices import MONTH_CHOICES, CROWD_CHOICES, RATING_CHOICES, SURF_WIND_DIRECTION_CHOICES


# Create your models here.
class Condition(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    surfzone = models.ForeignKey(SurfZone, on_delete=models.PROTECT, related_name='conditions')
    month = models.CharField(max_length=3, choices=MONTH_CHOICES.choices)
    water_temp = models.IntegerField(null=True, blank=True)
    swell_size_ft = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], null=True, blank=True)
    swell_size_meter = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(30.0)], null=True, blank=True)
    swell_consistency = models.IntegerField(null=True, blank=True)
    swell_direction = models.CharField(max_length=10, choices=SURF_WIND_DIRECTION_CHOICES.choices, blank=True)
    beginner = models.BooleanField(default=False)
    intermediate = models.BooleanField(default=False)
    advanced = models.BooleanField(default=False)
    pro = models.BooleanField(default=False)
    crowd = models.CharField(max_length=10, choices=CROWD_CHOICES.choices, blank=True)
    local_surf_rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES.choices, validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, default=3)
    world_surf_rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES.choices, validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, default=3)
    min_air_temp = models.IntegerField(null=True, blank=True)
    max_air_temp = models.IntegerField(null=True, blank=True)
    rain_quantity = models.IntegerField(null=True, blank=True)
    rain_days = models.IntegerField(null=True, blank=True)
    sunny_days = models.IntegerField(null=True, blank=True)
    wind_force = models.IntegerField( validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, null=True)
    wind_direction = models.CharField(max_length=10, choices=SURF_WIND_DIRECTION_CHOICES.choices, blank=True)
    wind_consistency = models.IntegerField(null=True, blank=True)
    slug = models.SlugField(max_length=150, blank=True, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.surfzone.name}-{self.month}")
            self.slug = f"{base_slug}-{uuid.uuid4().hex[:8]}"
            while Condition.objects.filter(slug=self.slug).exists():
                self.slug = f"{base_slug}-{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Conditions for {self.surfzone.name} in {self.month}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['surfzone', 'month'], name='unique_conditions_surfzone_month')
        ]