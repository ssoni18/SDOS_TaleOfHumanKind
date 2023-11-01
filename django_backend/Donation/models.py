from django.db import models
from Campaign.models import Campaign

class Donation(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    receipt_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(null=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE,null=True)
