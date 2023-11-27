from django.utils import timezone
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json
from .models import CustomUser, Address, EducationalResource, FeedItem ,Like
from django.contrib.auth import logout as auth_logout
from django.shortcuts import render,  HttpResponseRedirect
import bcrypt
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.core.serializers import serialize
from django.core.exceptions import ValidationError


@csrf_exempt
def is_authenticated(request):
    if request.user.is_authenticated:
        print("Authenticated!")
        return JsonResponse({'is_authenticated': True})
    else:
        print("Not Authenticated!")
        return JsonResponse({'is_authenticated': False})
 

@csrf_exempt
def user_signup(request):
    # Important: Add checks for duplicate email/username
    from .functions import validate_email, validate_phonenumber, validate_selectedRole, validate_selectedQualification, validate_firstname, validate_lastname, validate_password
    if request.method == 'POST':      
        try:  
            data  = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            firstName = data.get('firstName')
            lastName = data.get('lastName')
            phoneNumber = data.get('phoneNumber')
            selectedRole = data.get('selectedRole')
            selectedQualification = data.get('selectedQualification')
            
            if not validate_email(email):
                return JsonResponse({"status": "failure", "message": "Server: Invalid email"}, status=400)

            if not validate_phonenumber(phoneNumber):
                return JsonResponse({"status": "failure", "message": "Server: Invalid phone number"}, status=400)

            if not validate_selectedRole(selectedRole):
                return JsonResponse({"status": "failure", "message": "Server: Invalid role selected"}, status=400)

            if not validate_selectedQualification(selectedQualification):
                return JsonResponse({"status": "failure", "message": "Server: Invalid qualification selected"}, status=400)

            if not validate_password(password):
                return JsonResponse({"status": "failure", "message": "Server: Invalid password"}, status=400)

            if not validate_firstname(firstName):
                return JsonResponse({"status": "failure", "message": "Server: Invalid first name"}, status=400)

            if not validate_lastname(lastName):
                return JsonResponse({"status": "failure", "message": "Server: Invalid last name"}, status=400)

            # Check for duplicate email
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"status": "failure", "message": "Email already exists"}, status=400)
            
            user = CustomUser.objects.create_user(email=email, password=password)
            user.first_name = firstName
            user.last_name = lastName
            user.primary_phone_number = phoneNumber
            user.user_type = selectedRole
            user.qualification = selectedQualification
            address = Address.objects.create()
            user.address = address
        
            
            user.save()
            return JsonResponse({"status": "success", "message": "Server: Sign Up Successful! Please Login."}, status=200)

        except ValidationError as e:
            return JsonResponse({"status": "failure", "Server: message": str(e)}, status=400)
        
    return JsonResponse({'status': 'error', 'message': 'Server: Invalid request'})

@csrf_exempt
def login_auth(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        # Check for the existence of the user
        if not CustomUser.objects.filter(email=email).exists():
            return JsonResponse({'status': 'error', 'message': 'Server: User does not exist'}, status=400)
        
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            login(request, user)
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            address_data = serialize('json', [user.address])
            address = json.loads(address_data)[0]['fields']
            
            user_data = {
                'first_name' : user.first_name,
                'email': user.email,
                'user_type': user.user_type,
                'dob' : user.date_of_birth,
                'address': address,
                'phone' : user.primary_phone_number
            }
            print("auth?", request.user.is_authenticated)
            print("sesh items in login", request.session.items())
            
            return JsonResponse({'status': 'success' , 'message': "Server: Login Successful", 'user_data': user_data}, status=200)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Server: Invalid request'}, status=400)


@csrf_exempt
def logout(request):
    # Manually clear the session
    # request.session.flush()
    auth_logout(request)
    # request.session.save()  # Save the session after clearing it
    return JsonResponse({'status': 'success', 'message': 'Server: Logged out successfully'}, status=200)
    

@csrf_exempt
def Education_resources(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            title = request.POST.get('title')
            contenttype = request.POST.get('contenttype')
            resource_url = request.POST.get('resource_url')
            creator = request.user
            image = request.FILES.get('image')

            edu = EducationalResource.objects.create(
                title=title,
                content_type=contenttype,
                resource_url=resource_url,
                creator=creator,
                created_date=timezone.now(),
                updated_date=timezone.now(),
                image=image,
            )
            
            return JsonResponse({"status": "success", "message":"Resource Added Successfully!"}, status=200)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=400)

@csrf_exempt
def fetch_resources(request):
    if request.method == 'GET':
        resources = EducationalResource.objects.all()
        resources_list = list(resources.values('title', 'content_type', 'resource_url', 'creator__email', 'created_date', 'updated_date', 'image'))
        return JsonResponse(resources_list, safe=False)

@csrf_exempt
def get_feed(request):
    if request.method == 'GET':
        print(request)
        feed_items = FeedItem.objects.all()
        feed_list = list(feed_items.values('id','creator__email', 'content', 'image', 'likes', 'created_at', 'resource_url'))
        return JsonResponse(feed_list, safe=False)
    
@csrf_exempt
def likeFeedItem(request, id, email):
    print(request)
    if request.method == 'POST':
        user = CustomUser.objects.get(email=email)
        feed_item = FeedItem.objects.get(id=id)
        print(user)
        print(feed_item)
        Like.objects.create(user=user, feed_item=feed_item)
        feed_item.likes = feed_item.get_likes()  # Update the likes field
        feed_item.save()  # Save the changes
        return JsonResponse({'status': 'success', 'message': 'Feed item liked'})

@csrf_exempt
def unlikeFeedItem(request, id, email):
    if request.method == 'POST':
        user = CustomUser.objects.get(email=email)
        feed_item = FeedItem.objects.get(id=id)
        Like.objects.filter(user=user, feed_item=feed_item).delete()
        feed_item.likes = feed_item.get_likes()  # Update the likes field
        feed_item.save()  # Save the changes
        return JsonResponse({'status': 'success', 'message': 'Feed item unliked'})


