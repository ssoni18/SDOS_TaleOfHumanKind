from django.db import models
from User.models import User  # Make sure the import path is correct

class EducationalResource(models.Model):
    title = models.CharField(max_length=200,null=True)
    content_type = models.CharField(max_length=100,null=True)
    resource_url = models.CharField(max_length=200,null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE,null=True)  # Use the model name directly
    created_date = models.DateTimeField(null=True)
    updated_date = models.DateTimeField(null=True)
