from django.db import models
from django.contrib.auth.models import User

class CustomUser(User):
    address = models.ForeignKey('Address', on_delete=models.CASCADE, related_name='users' , null = True)
    date_of_birth = models.DateField(null=True)
    qualification = models.CharField(max_length=100 , null=True)  # Dropdown value for string
    primary_phone_number = models.CharField(max_length=20 , null=True)
    secondary_phone_number = models.CharField(max_length=20 , null=True)
    user_type = models.CharField(max_length=50)  # Dropdown for user type
    created_time = models.DateTimeField(null=True)
    updated_time = models.DateTimeField(null=True)
    social_handle = models.ForeignKey('SocialMediaHandle', on_delete=models.CASCADE, related_name='users' ,null=True)
    
    
class Address(models.Model):
    country = models.CharField(max_length=100,null=True)
    street_name = models.CharField(max_length=200,null=True)
    state = models.CharField(max_length=100,null=True)
    pincode = models.CharField(max_length=20,null=True)


class SocialMediaHandle(models.Model):
    facebook_link = models.CharField(max_length=200, blank=True, null=True)
    twitter_link = models.CharField(max_length=200, blank=True, null=True)
    linkedin_link = models.CharField(max_length=200, blank=True, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True)


class LoginDetails(models.Model):
    email = models.EmailField(null=True)
    password_hash = models.CharField(max_length=200,null=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,null=True)


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


class Donation(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    receipt_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(null=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE,null=True)


class EducationalResource(models.Model):
    title = models.CharField(max_length=200,null=True)
    content_type = models.CharField(max_length=100,null=True)
    resource_url = models.URLField(max_length=200,null=True)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True)  # Use the model name directly
    created_date = models.DateTimeField(null=True)
    updated_date = models.DateTimeField(null=True)
    image = models.ImageField(upload_to='images/',null=True)

class Transaction(models.Model):
    payment_id = models.CharField(max_length=200, verbose_name="Payment ID")
    order_id = models.CharField(max_length=200, verbose_name="Order ID")
    signature = models.CharField(max_length=500, verbose_name="Signature", blank=True, null=True)
    amount = models.IntegerField(verbose_name="Amount")
    created_at = models.DateTimeField(auto_now_add=True)
    
    
class FeedItem(models.Model):
    creater = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True)
    content = models.TextField()
    image = models.ImageField(upload_to='images/')  # new field for the image
    likes = models.IntegerField(default=0)  # new field for the likes counter
    created_at = models.DateTimeField(auto_now_add=True)
    resource_url = models.URLField(max_length=200,null=True)
