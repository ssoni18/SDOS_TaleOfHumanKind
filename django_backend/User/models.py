from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(null = True)
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
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)


class LoginDetails(models.Model):
    email = models.EmailField(null=True)
    password_hash = models.CharField(max_length=200,null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE,null=True)






