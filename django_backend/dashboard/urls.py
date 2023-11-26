from django.contrib import admin
from django.urls import path, include
from dashboard import views
urlpatterns = [
    path('login_auth/', views.login_auth, name='login_auth'),
    path('user_signup/', views.user_signup, name='user_signup'),
    path('logout/', views.logout, name='logout'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('is_authenticated/', views.is_authenticated, name='is_authenticated'),

    # path('google-login/', views.google_login, name='google_login'),
    path('EducationResource/' , views.Education_resources ,  name = 'EducationResource'),
    path('Fetchresources/' , views.fetch_resources , name = 'Fetchresources'),
    path('getfeed/',views.get_feed,name='feed'),
    path('incrementLikeCount/' , views.incrementLikeCount , name='incrementLikeCount'),
    path('decrementLikeCount/' , views.decrementLikeCount , name = 'decrementLikeCount'),
]