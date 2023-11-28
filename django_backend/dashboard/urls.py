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
    path('addEducationalResource/' , views.addEducationalResource ,  name='addEducationalResource'),
    path('fetchEducationalResources/' , views.fetchEducationalResources , name = 'fetchEducationalResources'),
    path('getfeed/',views.get_feed,name='feed'),
    path('likeFeedItem/<int:id>/<str:email>/' , views.likeFeedItem , name='likeFeedItem'),
    path('unlikeFeedItem/<int:id>/<str:email>/' , views.unlikeFeedItem , name='unlikeFeedItem'),
    path('get_user_role/' , views.get_user_role , name='get_user_role'),
]