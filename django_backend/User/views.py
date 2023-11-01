from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json
from .models import LoginDetails
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import login as request_login_user
from django.contrib.auth import logout as request_logout_user
from django.shortcuts import render,  HttpResponseRedirect

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
        if user and check_password(password, user.password_hash):
            request_login_user(
                request, user, backend='django.contrib.auth.backends.ModelBackend')
            return JsonResponse({'status': 'ok'})
        elif not user:
            response = -1
        else:
            response =0
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})
    # return render(request, 'login.html' , {'response':response , 'show_alert': response == 0 ,'show_alert2': response == -1  })
    
    # print(request)
    # if request.method == 'POST':
    #     data = json.loads(request.body)
    #     email = data.get('email')
    #     password = data.get('password')
    #     print(email)
    #     print(password)
    #     user = authenticate(request, username=email, password=password)

    #     if user is not None:
    #         login(request, user)
    #         # User is authenticated with Django's authentication.
    #         # Now you can link the user with the Google account.
    #         # ...
    #         return JsonResponse({'status': 'ok'})
    #     else:
    #         return JsonResponse({'status': 'error', 'message': 'Invalid credentials'})

    # return JsonResponse({'status': 'error', 'message': 'Invalid request'})

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




