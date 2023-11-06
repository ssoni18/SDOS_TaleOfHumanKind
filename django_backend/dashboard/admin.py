from django.contrib import admin
from .models import Campaign, CampaignChangemakers, Donation, EducationalResource, CustomUser, Address, SocialMediaHandle, Transaction
# Register your models here.
admin.site.register(Campaign)
admin.site.register(CampaignChangemakers)
admin.site.register(Donation)
admin.site.register(EducationalResource)
admin.site.register(CustomUser)
admin.site.register(Address)
admin.site.register(SocialMediaHandle)
admin.site.register(Transaction)