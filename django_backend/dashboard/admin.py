from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import Campaign, Donation, EducationalResource, CustomUser, Address, SocialMediaHandle

class CampaignAdmin(admin.ModelAdmin):
    list_display = ("title", "changemaker", "mentor", "isApproved")
    search_fields = ("title", "changemaker__first_name", "mentor__first_name")
    list_filter = ("isApproved",)
    # Add any other configuration you need here

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
admin.site.register(Donation)
admin.site.register(EducationalResource)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Campaign, CampaignAdmin)
admin.site.register(Address)
admin.site.register(SocialMediaHandle)