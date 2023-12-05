from django.contrib import admin
from django.urls import path, include
from dashboard import views
urlpatterns = [
    path('login_auth/', views.login_auth, name='login_auth'),
    path('user_signup/', views.user_signup, name='user_signup'),
    path('logout/', views.logout, name='logout'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('is_authenticated/', views.is_authenticated, name='is_authenticated'),
    path('activateUser/<uidb64>/<token>/', views.activateUser, name='activateUser'),
    # path('google-login/', views.google_login, name='google_login'),
    path('addEducationalResource/' , views.addEducationalResource ,  name='addEducationalResource'),
    path('fetchEducationalResources/' , views.fetchEducationalResources , name = 'fetchEducationalResources'),
    path('fetchCampaigns/' , views.fetchCampaigns , name = 'fetchCampaigns'),
    path('addCampaign/' , views.addCampaign ,  name='addCampaign'),
    path('fetchMentors/', views.fetchMentors, name='fetchMentors'),

    path('getfeed/',views.get_feed,name='feed'),
    path('likeFeedItem/<int:id>/<str:email>/' , views.likeFeedItem , name='likeFeedItem'),
    path('unlikeFeedItem/<int:id>/<str:email>/' , views.unlikeFeedItem , name='unlikeFeedItem'),
    path('get_user_role/' , views.get_user_role , name='get_user_role'),
    path('edit_profie/',views.edit_profile,name="edit_profile"),
    path('get_resources/' , views.get_resources,name='get_resources'),
    path('edit_resource/',views.edit_resource,name="edit_resource"),
    path('get_resource_id/<int:id>/' , views.get_resource_id , name = 'get_resource_id'),
    path('delete_resource/' , views.delete_resource , name = 'delete_resource'),
    path('fetch_feed/' , views.fetch_feed , name = 'fetch_feed'),
    path('addfeed/' , views.addfeed, name = 'addfeed'),
    path('delete_feed/' , views.delete_feed , name = 'delete_feed'),
    path('get_feed_id/<int:id>/' , views.get_feed_id , name = 'get_resource_id'),
    path('edit_feed/' , views.edit_feed , name = 'edit_feed'),
]