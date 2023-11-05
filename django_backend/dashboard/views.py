from django.utils import timezone
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json
from .models import CustomUser ,  Address
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import logout as auth_logout
from django.shortcuts import render,  HttpResponseRedirect
import bcrypt
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from backend import CustomUserModelBackend

@csrf_exempt
# def hash_password(password):
#     salt = bcrypt.gensalt()
#     hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
#     return hashed_password

# def verify_password(input_password, hashed_password):
#     return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))

@csrf_exempt
def user_signup(request):
    from .functions import validate_email, validate_phonenumber, validate_selectedRole, validate_selectedQualification
    if request.method == 'POST':        
        data  = json.loads(request.body)
        email = data.get('email')
        firstname = data.get('firstName')
        lastName = data.get('lastName')
        phoneNumber = data.get('phoneNumber')
        selectedRole = data.get('selectedRole')
        selectedQualification = data.get('selectedQualification')
        password = data.get('password')
        
        if not validate_email(email) or not validate_phonenumber(phoneNumber) or not validate_selectedRole(selectedRole) or not validate_selectedQualification(selectedQualification):
            return JsonResponse({"status": "failure", "message":"Invalid input data"}, status=400)
        
        user = CustomUser.objects.filter(Q(email=email))
        if user:
            return JsonResponse({"status": "failure", "message":"User already exists with this email"}, status=409)
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        address = Address.objects.create()
        custom_user = CustomUser.objects.create(
            username=email,
            first_name=firstname,
            last_name=lastName,
            email=email,
            password=hashed_password.decode('utf-8'),
            address=address,
            date_of_birth=None,
            qualification=selectedQualification,
            primary_phone_number=phoneNumber,
            secondary_phone_number=None,
            user_type=selectedRole,
            created_time=timezone.now(),
            updated_time=timezone.now(),
            social_handle=None
        )
        
        return JsonResponse({"status": "success", "message":"Sign Up Successful! Please Login."}, status=200)
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

@csrf_exempt
def login_auth(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        backend = CustomUserModelBackend()
        user = backend.authenticate(request, email=email, password=password)
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            user_data = {
                'first_name' : user.first_name,
                'email': user.email,
                'Date_of_Birth' : user.date_of_birth,
                'address': user.address,
                'phone' : user.primary_phone_number
            }
            
            return JsonResponse({'status': 'ok' , 'user_data': user_data})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'})
    

def logout(request):
    auth_logout(request)
    return JsonResponse({'status': 'ok', 'message': 'Logged out successfully'})
