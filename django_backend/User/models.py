from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    address = models.ForeignKey('Address', on_delete=models.CASCADE, related_name='users')
    date_of_birth = models.DateField()
    qualification = models.CharField(max_length=100)  # Dropdown value for string
    primary_phone_number = models.CharField(max_length=20)
    secondary_phone_number = models.CharField(max_length=20)
    user_type = models.CharField(max_length=50)  # Dropdown for user type
    created_time = models.DateTimeField()
    updated_time = models.DateTimeField()
    social_handle = models.ForeignKey('SocialMediaHandle', on_delete=models.CASCADE, related_name='users')

class Address(models.Model):
    address_id = models.AutoField(primary_key=True)
    country = models.CharField(max_length=100)
    street_name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='users')
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)


class SocialMediaHandle(models.Model):
    id = models.AutoField(primary_key=True)
    facebook_link = models.CharField(max_length=200, blank=True, null=True)
    twitter_link = models.CharField(max_length=200, blank=True, null=True)
    linkedin_link = models.CharField(max_length=200, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class LoginDetails(models.Model):
    email = models.EmailField()
    password_hash = models.CharField(max_length=200)
    salt_hash = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE)






