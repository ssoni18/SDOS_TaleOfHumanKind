from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    address = models.ForeignKey('Address', on_delete=models.CASCADE, related_name='users' , null=True)
    date_of_birth = models.DateField(null=True)
    qualification = models.CharField(max_length=100, null=True)  # Dropdown value for string
    primary_phone_number = models.CharField(max_length=20, null=True)
    secondary_phone_number = models.CharField(max_length=20, null=True)
    user_type = models.CharField(max_length=50)  # Dropdown for user type
    created_time = models.DateTimeField(null=True)
    updated_time = models.DateTimeField(null=True)
    social_handle = models.ForeignKey('SocialMediaHandle', on_delete=models.CASCADE, related_name='users', null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    profile_image = models.ImageField(upload_to='images/', null=True)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []    

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
    @property
    def age(self):
        if self.date_of_birth:
            today = timezone.now().date()
            age = today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
            return age
        else:
            return None


class Address(models.Model):
    country = models.CharField(max_length=100, null=True)
    street_name = models.CharField(max_length=200, null=True)
    state = models.CharField(max_length=100, null=True)
    pincode = models.CharField(max_length=20, null=True)

class SocialMediaHandle(models.Model):
    facebook_link = models.CharField(max_length=200, blank=True, null=True)
    twitter_link = models.CharField(max_length=200, blank=True, null=True)
    linkedin_link = models.CharField(max_length=200, blank=True, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)

class Campaign(models.Model):
    title = models.CharField(max_length=200, null=True)
    description = models.TextField(null=True)
    mentor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='mentored_campaigns', null=True)
    current_amount = models.IntegerField(default=0)
    goal_amount = models.IntegerField(default=0)
    isApproved = models.BooleanField(default=False, null=True)
    changemaker = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_campaigns', null=True)
    created_date = models.DateTimeField(null=True)
    updated_date = models.DateTimeField(null=True)
    image = models.ImageField(upload_to='images/', null=True)

class Donation(models.Model):
    email = models.EmailField(blank=True, null=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0)
    order_payment_id = models.CharField(max_length=200, verbose_name="Order ID")
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Donation -{self.amount}"

    
class EducationalResource(models.Model):
    title = models.CharField(max_length=200, null=True)
    content_type = models.CharField(max_length=100, null=True)
    resource_url = models.URLField(max_length=200, null=True)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='resources', to_field='email')
    created_date = models.DateTimeField(null=True)
    updated_date = models.DateTimeField(null=True)
    image = models.ImageField(upload_to='images/', null=True)
    
class FeedItem(models.Model):
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True)
    content = models.TextField()
    image = models.ImageField(upload_to='images/')  # new field for the image
    likes = models.IntegerField(default=0)  # new field for the likes counter
    created_at = models.DateTimeField(auto_now_add=True)
    resource_url = models.URLField(max_length=200,null=True)
    
    def get_likes(self):
        return Like.objects.filter(feed_item=self).count()

class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    feed_item = models.ForeignKey(FeedItem, on_delete=models.CASCADE)
