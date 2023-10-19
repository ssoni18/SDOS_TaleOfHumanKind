from django.db import models
from User.models import User

class Campaign(models.Model):
    campaign_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    approved = models.BooleanField()
    leader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='led_campaigns')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentored_campaigns')
    current_amount = models.DecimalField(max_digits=10, decimal_places=2)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    file_url = models.CharField(max_length=200)
    changemaker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_campaigns')
    created_date = models.DateTimeField()
    updated_date = models.DateTimeField()


class CampaignChangemakers(models.Model):
    id = models.AutoField(primary_key=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    changemaker = models.ForeignKey(User, on_delete=models.CASCADE)