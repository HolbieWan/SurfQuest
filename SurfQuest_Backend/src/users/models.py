import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    latitude = models.FloatField(max_length=10, null=True, blank=True)
    longitude = models.FloatField(max_length=10, null=True, blank=True)
    nearest_airport = models.CharField(max_length=100, null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    preferences = models.JSONField(null=True, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    slug = models.SlugField(max_length=150, blank=True, unique=True)

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.username)
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['username']

    def get_absolute_url(self):
        return reverse("blog-post", kwargs={"slug": self.slug})


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    surf_zone = models.ForeignKey('surfzones.SurfZone', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    surf_spot = models.ForeignKey('surfzones.SurfSpot', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField(max_length=2000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review by {self.user.username} - Rating: {self.rating}"
    
    class Meta:
        unique_together = ('user', 'surf_zone')  # Ensures only 1 review per user per surf zone
        unique_together = ('user', 'surf_spot')  # Ensures only 1 review per user per surf spot
    
    # def save(self, *args, **kwargs):
    #     if not self.slug:
    #         self.slug = slugify(self.user.name)
    #     super().save(*args, **kwargs)
