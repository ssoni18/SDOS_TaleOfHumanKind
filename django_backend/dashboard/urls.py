from django.contrib import admin
from django.urls import path
from dashboard import views
urlpatterns = [
    path('login_auth/', views.login_auth, name='login_auth'),
    path('user_signup/', views.user_signup, name='user_signup'),
    path('logout/', views.logout, name='logout'),
    # path('google-login/', views.google_login, name='google_login'),
]