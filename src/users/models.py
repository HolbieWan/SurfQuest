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
    nearest_airport = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.username
