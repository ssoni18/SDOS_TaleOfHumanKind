from django.contrib import admin
from .models import CustomUser,Address,SocialMediaHandle,LoginDetails
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Address)
admin.site.register(SocialMediaHandle)
admin.site.register(LoginDetails)
