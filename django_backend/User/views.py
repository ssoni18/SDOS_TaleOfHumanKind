from django.utils import timezone
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json
from .models import LoginDetails
from .models import User ,  Address
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import login as request_login_user
from django.contrib.auth import logout as request_logout_user
from django.shortcuts import render,  HttpResponseRedirect
import bcrypt



@csrf_exempt
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

def verify_password(input_password, hashed_password):
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password)

@csrf_exempt
def user_signup(request):
    if request.method == 'POST':
        
        data  = json.loads(request.body)
        email = data.get('email')
        firstname = data.get('firstName')
        lastName = data.get('lastName')
        phoneNumber = data.get('phoneNumber')
        selectedRole = data.get('selectedRole')
        selectedQualification = data.get('selectedQualification')
        password = data.get('password')
        user = User.objects.filter(Q(email = email))
        if user:
            return JsonResponse({"status": "failure", "message":"User already exists with this email"}, status=409)
        else:
            user = User(email = email)
            # user.email = email
            password = hash_password(password)
            user.first_name = firstname
            user.last_name = lastName
            user.email = email
            address = Address()
            user.address = address
            user.date_of_birth = None
            user.qualification = selectedQualification
            user.primary_phone_number = phoneNumber
            user.secondary_phone_number = None
            user.user_type = selectedRole
            user.created_time = timezone.now()
            user.updated_time = timezone.now()
            user.social_handle  = None
            address.save()
            user.save()
            
            login = LoginDetails()
            login.email = email
            login.password_hash = password
            login.user = user
            login.save()
            
            return JsonResponse({"status": "success", "message":"Sign Up Successfull!! Please Login"}, status=200)
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})
@csrf_exempt
def login_auth(request):
    response = 1
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        print(email)
        print(password)
        user = LoginDetails.objects.filter(
            Q(email=email)).last()
        if user and verify_password(password, user.password_hash):
            request_login_user(
                request, user, backend='django.contrib.auth.backends.ModelBackend')
            return JsonResponse({'status': 'ok'})
        elif not user:
            response = -1
        else:
            response =0
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})
    # return render(request, 'login.html' , {'response':response , 'show_alert': response == 0 ,'show_alert2': response == -1  })
    








# # Create your views here.

# import json
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from allauth.socialaccount.providers.oauth2.client import OAuth2Error
# from allauth.socialaccount.providers.oauth2.views import OAuth2Adapter, OAuth2CallbackView
# from allauth.socialaccount.models import SocialToken
# from allauth.socialaccount.models import SocialApp, SocialAccount
# from django.contrib.auth import get_user_model
# from django.core.exceptions import ObjectDoesNotExist
# from rest_framework import status
# from rest_framework.response import Response

# @csrf_exempt
# def google_login(request):
#     try:
#         # Verify and handle the Google login callback using the OAuth2Adapter
#         oauth2_adapter = OAuth2Adapter()
#         login_view = OAuth2CallbackView.as_view(adapter=oauth2_adapter)
#         response = login_view(request)

#         # Check if the user is authenticated
#         if not request.user.is_authenticated:
#             return JsonResponse({'error': 'Authentication failed. Please log in before using Google login.'}, status=401)

#         # Verify if the user has a Google SocialAccount
#         try:
#             social_account = SocialAccount.objects.get(user=request.user, provider='google')
#         except ObjectDoesNotExist:
#             return JsonResponse({'error': 'No Google account linked to this user.'}, status=400)

#         # Extract the Google access token
#         social_token = SocialToken.objects.get(account=social_account)

#         # You can further process or store this token on the server as needed for future interactions with Google services.
#         return JsonResponse({'message': 'Google login successful', 'access_token': social_token.token})
    
#     except OAuth2Error as e:
#         return JsonResponse({'error': f'Google login failed. Error: {str(e)}'}, status=400)




