# from django.db import models
# from user.models import User
# from surfzones.models import SurfZone, SurfSpot

# class Review(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
#     surf_spot = models.ForeignKey(SurfSpot, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
#     surf_zone = models.ForeignKey(SurfZone, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
#     rating = models.PositiveSmallIntegerField()  # Note de 1 à 5
#     comment = models.TextField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Review by {self.user.username} on {self.surf_spot or self.surf_zone}"


# class Favorite(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
#     surf_spot = models.ForeignKey(SurfSpot, on_delete=models.CASCADE, null=True, blank=True, related_name='favorited_by')
#     surf_zone = models.ForeignKey(SurfZone, on_delete=models.CASCADE, null=True, blank=True, related_name='favorited_by')
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Favorite by {self.user.username} on {self.surf_spot or self.surf_zone}"