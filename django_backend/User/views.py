from django.utils import timezone
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json
from .models import LoginDetails
from .models import CustomUser ,  Address
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate , login 
from django.contrib.auth import logout as auth_logout
from django.shortcuts import render,  HttpResponseRedirect
import bcrypt
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

@csrf_exempt
# def hash_password(password):
#     salt = bcrypt.gensalt()
#     hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
#     return hashed_password

# def verify_password(input_password, hashed_password):
#     return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))

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
        user = CustomUser.objects.filter(Q(email = email))
        if user:
            return JsonResponse({"status": "failure", "message":"User already exists with this email"}, status=409)
        else:
            password = make_password(password)
            address = Address()
            Customuser = CustomUser()
            Customuser.username = email
            Customuser.first_name = firstname
            Customuser.last_name = lastName
            Customuser.email = email
            Customuser.password = password
            Customuser.address = address
            Customuser.date_of_birth = None
            Customuser.qualification = selectedQualification
            Customuser.primary_phone_number = phoneNumber
            Customuser.secondary_phone_number = None
            Customuser.user_type = selectedRole
            Customuser.created_time = timezone.now()
            Customuser.updated_time = timezone.now()
            Customuser.social_handle  = None
            # Customuser.last_login  = timezone.now()
            address.save()
            Customuser.save()
            
            login = LoginDetails()
            login.email = email
            login.password_hash = password
            login.user = Customuser
            login.save()
            
            return JsonResponse({"status": "success", "message":"Sign Up Successfull!! Please Login"}, status=200)
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})
@csrf_exempt

def login_auth(request):
    # import ipdb; ipdb.set_trace()
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        print(email)
        print(password)
        user = LoginDetails.objects.filter(
            Q(email=email)).last()
        if user and check_password(password, user.password_hash):
           
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            print("OK")
            # custom_user = CustomUser.objects.get(email=email)
            user_data = {
                'first_name' : user.user.first_name,
                'email': user.user.email,
                'Date_of_Birth' : user.user.date_of_birth,
                'address': user.user.address,
                'phone' :user.user.primary_phone_number
            }
            print(user.first_name)
            return JsonResponse({'status': 'ok' , 'user_data': user_data})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'})
    

def logout(request):
    auth_logout(request)
    return JsonResponse({'status': 'ok', 'message': 'Logged out successfully'})





