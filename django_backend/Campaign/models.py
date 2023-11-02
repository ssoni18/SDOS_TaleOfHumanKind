from django.db import models
from User.models import CustomUser

class Campaign(models.Model):
    title = models.CharField(max_length=200,null=True)
    description = models.TextField(null=True)
    approved = models.BooleanField(null=True)
    leader = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='led_campaigns',null=True)
    mentor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='mentored_campaigns',null=True)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    category = models.CharField(max_length=100,null=True)
    file_url = models.CharField(max_length=200,null=True)
    changemaker = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_campaigns',null=True)
    created_date = models.DateTimeField(null=True)
    updated_date = models.DateTimeField(null=True)


class CampaignChangemakers(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE,null=True)
    changemaker = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True)