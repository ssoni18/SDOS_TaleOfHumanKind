from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import Campaign, CampaignChangemakers, Donation, EducationalResource, CustomUser, Address, SocialMediaHandle, Transaction

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("email", "is_staff", "is_active",)
    list_filter = ("email", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password", "first_name", "last_name")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)
# Register your models here.
admin.site.register(Campaign)
admin.site.register(CampaignChangemakers)
admin.site.register(Donation)
admin.site.register(EducationalResource)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Address)
admin.site.register(SocialMediaHandle)
admin.site.register(Transaction)