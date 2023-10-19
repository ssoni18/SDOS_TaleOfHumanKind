from django.db import models
from User.models import User  # Make sure the import path is correct

class EducationalResource(models.Model):
    resource_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    content_type = models.CharField(max_length=100)
    resource_url = models.CharField(max_length=200)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)  # Use the model name directly
    created_date = models.DateTimeField()
    updated_date = models.DateTimeField()
