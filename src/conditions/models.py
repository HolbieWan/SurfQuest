import uuid
from django.db import models
from surfzones.models import SurfZone


# Create your models here.
class Conditions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    surfzone = models.ForeignKey(SurfZone, on_delete=models.CASCADE, related_name='conditions')
    month = models.CharField(max_length=100)
    water_temp = models.IntegerField()
    swell_size = models.FloatField(max_length=10)
    swell_consistancy = models.IntegerField()
    swell_direction = models.CharField(max_length=100)
    beginers = models.BooleanField(default=False)
    intermediate = models.BooleanField(default=False)
    advanced = models.BooleanField(default=False)
    pro = models.BooleanField(default=False)
    crowds = models.CharField(max_length=100)
    local_surf_quality = models.CharField(max_length=100)
    global_surf_rating = models.CharField(max_length=100)
    min_air_temp = models.IntegerField()
    max_air_temp = models.IntegerField()
    rain_quantity = models.IntegerField()
    rain_days = models.IntegerField()
    wind_force = models.IntegerField()
    wind_direction = models.CharField(max_length=100)
    wind_consistency = models.IntegerField()

    def __str__(self):
        return f"Conditions for {self.surfzone.name} on {self.month}"