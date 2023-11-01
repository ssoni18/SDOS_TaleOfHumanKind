from django.contrib import admin
from .models import User,Address,SocialMediaHandle,LoginDetails
# Register your models here.
admin.site.register(User)
admin.site.register(Address)
admin.site.register(SocialMediaHandle)
admin.site.register(LoginDetails)
