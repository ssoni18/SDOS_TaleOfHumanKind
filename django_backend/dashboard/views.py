from django.utils import timezone
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import CustomUser, Address, EducationalResource, FeedItem ,Like, Campaign, Donation
import os
from django.db.models import Q

from django.contrib.auth import logout as auth_logout
from django.core.serializers import serialize
from django.core.exceptions import ValidationError
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from datetime import datetime
from django.contrib.auth import get_user_model

import razorpay
from django.http import HttpResponse
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
import razorpay
from rest_framework.response import Response
from rest_framework import status
import json

@csrf_exempt
@api_view(['POST'])
def verifySignature(request):
    data= json.loads(request.body)
    ord_id = ""
    raz_pay_id = ""
    raz_signature = ""
    for key in data.keys():
        if key == 'razorpay_order_id':
            ord_id = data[key]
        elif key == 'razorpay_payment_id':
            raz_pay_id = data[key]
        elif key == 'razorpay_signature':
            raz_signature = data[key]

    # get order by payment_id which we've created earlier with isPaid=False
    order = Donation.objects.get(order_payment_id=ord_id)

    # we will pass this whole data in razorpay client to verify the payment
    data = {
        'razorpay_order_id': ord_id,
        'razorpay_payment_id': raz_pay_id,
        'razorpay_signature': raz_signature
    }
    client = razorpay.Client(auth=(os.environ.get("REACT_APP_PUBLIC_KEY"), os.environ.get("REACT_APP_SECRET_KEY")))

    # checking if the transaction is valid or not by passing above data dictionary in 
    # razorpay client if it is "valid" then check will return None
    check = client.utility.verify_payment_signature(data)

    if check is not None:
        print("Redirect to error url or error page")
        return Response({'error': 'Something went wrong'})

    # if payment is successful that means check is None then we will turn isPaid=True
    order.is_paid = True
    campaignObj = order.campaign   
    campaignObj.current_amount = campaignObj.current_amount + order.amount
    campaignObj.save()
    order.save()
    res_data = {
        'message': 'payment successfully received!'
    }

    return Response(res_data)

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
    from .functions import validate_email, validate_phonenumber, validate_selectedRole, validate_selectedQualification, validate_firstname, validate_lastname, validate_password_length, validate_password_match
    if request.method == 'POST':      
        try:  
            data  = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            confirmPassword = data.get('confirmPassword')
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

            if not validate_password_length(password):
                return JsonResponse({"status": "failure", "message": "Server: Invalid password"}, status=400)
            
            if not validate_password_match(password, confirmPassword):
                return JsonResponse({"status": "failure", "message": "Server: Passwords don't match"}, status=400)

            if not validate_firstname(firstName):
                return JsonResponse({"status": "failure", "message": "Server: Invalid first name"}, status=400)

            if not validate_lastname(lastName):
                return JsonResponse({"status": "failure", "message": "Server: Invalid last name"}, status=400)

            # Check for duplicate email
            existing_user = CustomUser.objects.filter(email=email).first()
            if existing_user:
                if existing_user.is_active:
                    return JsonResponse({"status": "failure", "message": "Email already exists"}, status=400)
                else:
                    existing_user.delete()  # Delete the inactive user

            
            user = CustomUser.objects.create_user(email=email, password=password)
            user.first_name = firstName
            user.last_name = lastName
            user.primary_phone_number = phoneNumber
            user.user_type = selectedRole
            user.qualification = selectedQualification
            address = Address.objects.create()
            user.address = address
            # Save the user
            user.save()

            # Send activation token for Email confirmation
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            mail_subject = 'Activate your account!'
            message = render_to_string('activation_mail.html', {
                'user': user,
                'domain': os.environ.get("DJANGO_APP_API_URL"),  # Or just directly use the domain name
                'uid': uid,
                'token': token,
            })
            email = EmailMessage(mail_subject, message, to=[user.email])
            email.send()

            return JsonResponse({"status": "success", "message": "Server: Sign Up Successful! Please check your email to activate your account."}, status=200)
        except ValidationError as e:
            return JsonResponse({"status": "failure", "Server: message": str(e)}, status=400)
        
    return JsonResponse({'status': 'error', 'message': 'Server: Invalid request'})

@csrf_exempt
def login_auth(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        user = CustomUser.objects.filter(email=email).first()
        # Check for the existence of the user
        if not user:
            return JsonResponse({'status': 'error', 'message': 'Server: User does not exist'}, status=400)
        
        # Check if the user's account is active
        if not user.is_active:
            return JsonResponse({'status': 'error', 'message': 'Server: Please activate your account before logging in'}, status=400)
        
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            request.session['user_type'] = user.user_type
            login(request, user)
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            # Serialize the address and profile image
            address_data = serialize('json', [user.address])
            address = json.loads(address_data)[0]['fields']
            if user.profile_image:
                profile_image_url = user.profile_image.url[7:]  # Trim off the "/media" prefix
            else:
                profile_image_url = None
            
            user_data = {
                'id': user.id,
                'first_name' : user.first_name,
                'last_name' : user.last_name,
                'email': user.email,
                'user_type': user.user_type,
                'dob' : user.date_of_birth,
                'age': user.age,
                'address': address,
                'phone' : user.primary_phone_number,
                'profile_image': profile_image_url
            }
            
            return JsonResponse({'status': 'success' , 'message': "Server: Login Successful", 'user_data': user_data}, status=200)
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Server: Invalid request'}, status=400)


@csrf_exempt
def getUserData(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            user = CustomUser.objects.get(email=request.user.email)

            # Serialize the address and profile image
            address_data = serialize('json', [user.address])
            address = json.loads(address_data)[0]['fields']
            if user.profile_image:
                profile_image_url = user.profile_image.url[7:]  # Trim off the "/media" prefix
            else:
                profile_image_url = None

            user_data = {
                'id': user.id,
                'first_name' : user.first_name,
                'last_name' : user.last_name,
                'email': user.email,
                'user_type': user.user_type,
                'dob' : user.date_of_birth,
                'age': user.age,
                'address': address,
                'phone' : user.primary_phone_number,
                'profile_image': profile_image_url
            }
            return JsonResponse({'status': 'success', 'user_data': user_data}, status=200)
        else:
            return JsonResponse({'status': 'error', 'message': 'User not authenticated'}, status=401)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


@csrf_exempt
def logout(request):
    # Manually clear the session
    # request.session.flush()
    auth_logout(request)
    # request.session.save()  # Save the session after clearing it
    return JsonResponse({'status': 'success', 'message': 'Server: Logged out successfully'}, status=200)



@csrf_exempt
def activateUser(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=uid)
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return redirect(f'{os.environ.get("REACT_APP_API_URL")}/login?activated=true')
        else:
            return redirect(f'{os.environ.get("REACT_APP_API_URL")}/login?activated=false')
    except(TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        return redirect(f'{os.environ.get("REACT_APP_API_URL")}/login?activated=false')

    
@csrf_exempt
def fetchMentors(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            try:
                mentors = CustomUser.objects.filter(user_type="Mentor")
                mentors_data = {mentor.email: mentor.first_name for mentor in mentors}
                response_data = {'mentors': mentors_data}
                return JsonResponse(response_data)
            except ValidationError as e:
                return JsonResponse({"status": "failure", "Server: message": str(e)}, status=400)
    else:
        return JsonResponse({'is_authenticated': False})

@csrf_exempt
def fetchTeam(request):
    if request.method == 'GET':
        try:
            print("here")
            members = CustomUser.objects.filter(is_active=True).exclude(user_type="")
            member_list = list(members.values("first_name", "user_type", "profile_image"))
            return JsonResponse(member_list, safe=False)
        except ValidationError as e:
            return JsonResponse({"status": "failure", "Server: message": str(e)}, status=400)

@csrf_exempt
def getMentor(email):
    try:
        user = CustomUser.objects.get(email=email)
        return user
    except CustomUser.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User does not exist'}, status=400)
    
@csrf_exempt
def addCampaign(request):
    # return (request)
    if request.user.is_authenticated:
        # Verify that the user is a Changemaker
        if request.user.user_type != 'Changemaker':
            return JsonResponse({'status': 'error', 'message': 'Only Changemakers can create campaigns!'}, status=403)
        if request.method == 'POST':
            try:
                title = request.POST.get('title')
                description = request.POST.get('description')
                goal_amount = int(request.POST.get('goalAmount'))
                creator = request.user
                email = request.POST.get('Mentor')
                Mentor = getMentor(email)
                image = request.FILES.get('image')


                if not CustomUser.objects.filter(email=email).exists():
                    return JsonResponse({'status': 'error', 'message': 'Server: User does not exist'}, status=400)
        
                # # Check if all required fields are provided
                if not title or not description:
                    return JsonResponse({'status': 'error', 'message': 'All fields are required!'}, status=400)

                if goal_amount<0:
                    return JsonResponse({'status': 'error', 'message': 'Goal Amount should be greater than zero!'}, status=400)

                edu = Campaign.objects.create(
                    title=title,
                    description=description,
                    mentor=Mentor,
                    current_amount=0,
                    goal_amount=goal_amount,
                    changemaker=creator,
                    created_date=timezone.now(),
                    updated_date=timezone.now(),
                    image=image,
                )
                return JsonResponse({"status": "success", "message":"Campaign  Added Successfully!"}, status=200)
            
            except ValidationError as e:
                return JsonResponse({"status": "failure", "Server: message": str(e)}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)
    

@csrf_exempt
def fetchCampaignInvitations(request):
     if request.user.is_authenticated:
        # Check if the user is a Mentor
        if request.user.user_type != 'Mentor':
            return JsonResponse({'status': 'error', 'message': 'Only Mentors can handle Invites to campaigns!'}, status=403)
     
        if request.method == 'GET':
            try:
                print(request.user.first_name)
                email = request.user.email
                campaign = Campaign.objects.filter(isApproved=False, mentor__email=email)
                campaign_list = list(campaign.values('id', 'title', 'description', 'mentor__first_name', 'changemaker__first_name', 'image'))
                return JsonResponse(campaign_list, safe=False)
                        
            except ValidationError as e:
                return JsonResponse({"status": "failure", "Server: message": str(e)}, status=400)
        else:
            return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)

@csrf_exempt
def manageCampaignInvitations(request):
    if request.user.is_authenticated:
        
        # Check if the user is a Mentor
        if request.user.user_type != 'Mentor':
            return JsonResponse({'status': 'error', 'message': 'Only Mentors can accept/reject Invites!'}, status=403)
        
        campaignId = request.POST.get('id')
        status = request.POST.get('status')
        campaignObj=None
        email = request.user.email
        print(campaignId)

        #Check if the Campaign Exists
        campaignObj = Campaign.objects.filter(id=campaignId).first()
        if not campaignObj:
            return JsonResponse({'status': 'error', 'message': 'Server: Campaign does not exist'}, status=400)
        
        print(campaignId)
        print(campaignObj.title)
        
        #check if Mentor is only changing the status of Campaigns for which he has the rights to
        if not campaignObj.mentor.email==email:
            return JsonResponse({'status': 'error', 'message': 'No rights to update on this campaign.'}, status=403)
    
        if status not in ['accepted', 'rejected']:
            return JsonResponse({'status': 'error', 'message': 'Invalid Operations on this campaign.'}, status=403)
    
        if request.method == 'POST':
            if(status=='accepted'):
                campaignObj.isApproved=True
            
            elif(status=='rejected'):
                campaignObj.isApproved=False
            
            campaignObj.save()
            
            # Delete campaign if rejected
            if status == 'rejected':
                campaignObj.delete()
            
            
            return JsonResponse({"status": "success", "message":"Operation done successfully!"}, status=200)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)
    
@csrf_exempt
def addEducationalResource(request):
    if request.user.is_authenticated:
        # Check if the user is a Mentor
        if request.user.user_type != 'Mentor':
            return JsonResponse({'status': 'error', 'message': 'Only Mentors can add resources!'}, status=403)

        if request.method == 'POST':
            print("request data",request.POST.get('title'))
            
            print("request data",request.POST.get('contenttype'))
            
            print("request data",request.POST.get('resourceUrl'))
            
            title = request.POST.get('title')
            contenttype = request.POST.get('contenttype')
            resource_url = request.POST.get('resourceUrl')
            creator = request.user
            image = request.FILES.get('image')
            print(title, contenttype,resource_url)
            # Check if all required fields are provided
            if not title or not contenttype or not resource_url:
                return JsonResponse({'status': 'error', 'message': 'All fields are required!'}, status=400)

            edu = EducationalResource.objects.create(
                title=title,
                content_type=contenttype,
                resource_url=resource_url,
                creator=creator,
                created_date=timezone.now(),
                updated_date=timezone.now(),
                image=image,  # If no image is provided, add a default image
            )
            
            return JsonResponse({"status": "success", "message":"Resource Added Successfully!"}, status=200)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)
    

@csrf_exempt
def fetchEducationalResources(request):
    if request.method == 'GET':
        resources = EducationalResource.objects.all()
        resources_list = list(resources.values('title', 'content_type', 'resource_url', 'creator__email', 'creator__id', 'created_date', 'updated_date', 'image'))
        return JsonResponse(resources_list, safe=False)

@csrf_exempt
def createOrder(request):
    if request.method == 'POST':
        try:
            client = razorpay.Client(auth=(os.environ.get("REACT_APP_PUBLIC_KEY"), os.environ.get("REACT_APP_SECRET_KEY")))
            print(os.environ.get("REACT_APP_PUBLIC_KEY"),os.environ.get("REACT_APP_SECRET_KEY"))
            amount = int(request.POST.get('amount'))
            campaignId = request.POST.get('campaignId')
            name = request.POST.get('name')
            email = request.POST.get('email')
            
            if not Campaign.objects.filter(id=campaignId).exists():
                return JsonResponse({'status': 'error', 'message': 'Server: Campaign does not exist'}, status=400)
            campaignArr = Campaign.objects.filter(id=campaignId)
            campaignObj=campaignArr[0]
            if amount<=0:
                return JsonResponse({'status': 'error', 'message': 'Goal Amount should be greater than zero!'}, status=400)

            if name!="" and email!="":
                notes={
                    'name': name,
                    'email': email
                }
            else:
                notes={}
            print(amount, campaignId, name, email)
            
            response = client.order.create({
                'amount': amount * 100,  # amount in the smallest currency unit
                'currency': 'INR',
                'receipt':  "for Campaign: "+campaignId,
                'notes': notes
            })
            donation = Donation.objects.create(
                email=email, 
                campaign=campaignObj,
                amount=amount,
                order_payment_id=response['id'],
                is_paid=False,
                created_at=timezone.now(),
            )
            
            return JsonResponse({'order_id': response['id'], 'amount': response['amount']})
            
        except ValidationError as e:
                return JsonResponse({"status": "failure", "Server: message": str(e)}, status=400)

@csrf_exempt
def fetchCampaigns(request):
    if request.method == 'GET':
        campaign = Campaign.objects.filter(isApproved=True)
        campaign_list = list(campaign.values('id', 'title', 'description', 'mentor__first_name', 'changemaker__first_name', 'image', 'goal_amount', 'current_amount'))
        return JsonResponse(campaign_list, safe=False)

@csrf_exempt
def get_feed(request):
    if request.method == 'GET':
        print(request)
        feed_items = FeedItem.objects.all()
        feed_list = list(feed_items.values('id','creator__email', 'creator__id', 'content', 'image', 'likes', 'created_at', 'resource_url'))
        return JsonResponse(feed_list, safe=False)
    

@csrf_exempt
def likeFeedItem(request, id, email):
    print(request)
    if request.method == 'POST':
        if request.user.is_authenticated:
            user = CustomUser.objects.get(email=email)
            feed_item = FeedItem.objects.get(id=id)
            print(user)
            print(feed_item)
            Like.objects.create(user=user, feed_item=feed_item)
            feed_item.likes = feed_item.get_likes()  # Update the likes field
            feed_item.save()  # Save the changes
            return JsonResponse({'status': 'success', 'message': 'Feed item liked'})
        else:
            return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)


@csrf_exempt
def unlikeFeedItem(request, id, email):
    if request.method == 'POST':
        if request.user.is_authenticated:
            user = CustomUser.objects.get(email=email)
            feed_item = FeedItem.objects.get(id=id)
            Like.objects.filter(user=user, feed_item=feed_item).delete()
            feed_item.likes = feed_item.get_likes()  # Update the likes field
            feed_item.save()  # Save the changes
            return JsonResponse({'status': 'success', 'message': 'Feed item unliked'})
        else:
            return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)

@csrf_exempt
def get_resources(request):
    print(request)
    if request.user.is_authenticated:
        resources = EducationalResource.objects.filter(creator=request.user)
        data = [{"id": r.id,"title": r.title, "content_type": r.content_type, "resource_url": r.resource_url} for r in resources]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)



@csrf_exempt
def editProfile(request):
    print(request)
    from .functions import validate_phonenumber,validate_firstname, validate_lastname,validate_pincode,validate_country,validate_state,validate_Street
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                email = request.user.email  # Get the email of the authenticated user

                phoneNumber = request.POST.get('phone')
                firstName=request.POST.get('first_name')
                lastName = request.POST.get('last_name')
                country = request.POST.get('address[country]')
                pincode = request.POST.get('address[pincode]')
                streetname = request.POST.get('address[streetname]')
                state = request.POST.get('address[state]')
                dob = request.POST.get('dob')
                image = request.FILES.get('profileImage')
                print('image', image)
                if email != request.POST.get('email'):
                    return JsonResponse({"status": "failure", "message": "Server: Unauthorized Operation"}, status=401)
                
                if not validate_phonenumber(phoneNumber):
                    return JsonResponse({"status": "failure", "message": "Server: Invalid phone number"}, status=400)

                if not validate_firstname(firstName):
                    return JsonResponse({"status": "failure", "message": "Server: Invalid first name"}, status=400)

                if not validate_lastname(lastName):
                    return JsonResponse({"status": "failure", "message": "Server: Invalid last name"}, status=400)
                
                if not validate_pincode(pincode):
                    return JsonResponse({"status": "failure", "message": "Server: Invalid Pincode"}, status=400)
                
                if not validate_Street(streetname):
                    
                    return JsonResponse({"status": "failure", "message": "Server: Invalid last name"}, status=400)
                
                if not validate_country(country):
                    
                    return JsonResponse({"status": "failure", "message": "Server: Invalid last name"}, status=400)
                
                if not validate_state(state):
                    
                    return JsonResponse({"status": "failure", "message": "Server: Invalid last name"}, status=400)
                        
                # Update fields
                user = CustomUser.objects.get(email=email)  # Fetch the user
                user.first_name = firstName
                user.last_name = lastName
                user.primary_phone_number = phoneNumber
                dob = datetime.strptime(dob, '%Y-%m-%d').date()
                user.date_of_birth = dob
                user.profile_image = image
                print(user.first_name)
                print(user.date_of_birth)
                
                address = user.address
                user.address.country = country
                user.address.street_name = streetname
                user.address.state = state
                user.address.pincode = pincode
                print(user.address.country)
                address.save()
                user.address = address

                # Save changes
                user.save()
                
                # Serialize the address and profile image
                address_data = serialize('json', [user.address])
                address = json.loads(address_data)[0]['fields']
                if user.profile_image:
                    profile_image_url = user.profile_image.url[7:]  # Trim off the "/media" prefix
                else:
                    profile_image_url = None

                print('profile before sending', profile_image_url)

                user_data = {
                    'id': user.id,
                    'first_name' : user.first_name,
                    'last_name' : user.last_name,
                    'email': user.email,
                    'user_type': user.user_type,
                    'dob' : user.date_of_birth,
                    'age': user.age,
                    'address': address,
                    'phone' : user.primary_phone_number,
                    'profile_image': profile_image_url
                }

                return JsonResponse({"status": "success", "message": "Profile updated successfully!", 'user_data': user_data}, status=200)

            except CustomUser.DoesNotExist:
                return JsonResponse({"status": "failure", "message": "User does not exist"}, status=400)

            except Exception as e:
                return JsonResponse({"status": "failure", "message": str(e)}, status=400)

        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)
    

@csrf_exempt
def edit_resource(request):
    print(request)
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                # print(request.FILES)
                title = request.POST.get('title')
                content_type=request.POST.get('content_type')
                resource_url = request.POST.get('resource_url')
                image = request.FILES.get('profileImage')
                id = request.POST.get('id')
                print(image)
                user = EducationalResource.objects.get(id=id)  # Fetch the user
                print(user)
                user.title = title
                user.content_type =  content_type
                user.resource_url = resource_url
                user.image = image
                user.save()

                return JsonResponse({"status": "success", "message": "resource updated successfully!"}, status=200)

            except CustomUser.DoesNotExist:
                return JsonResponse({"status": "failure", "message": "resource does not exist"}, status=400)

            except Exception as e:
                return JsonResponse({"status": "failure", "message": str(e)}, status=400)

        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)
    

@csrf_exempt
def get_resource_id(request,id):
    # Get the resource with the specified ID
    resource = EducationalResource.objects.get(id=id)

    # Check if the requested resource belongs to the currently logged-in user
    if request.user != resource.creator:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    # Serialize the resource's data
    data = {"id": resource.id, "title": resource.title, "content_type": resource.content_type, "resource_url": resource.resource_url, "creator": resource.creator.email}
    
    return JsonResponse(data)


@csrf_exempt
def delete_resource(request):
    if request.method == 'POST':
        # Get the resource ID from the request body
        data = json.loads(request.body)
        id = data.get('id')

        # Get the resource with the specified ID
        resource = EducationalResource.objects.get(id=id)

        # Check if the requested resource belongs to the currently logged-in user
        if request.user != resource.creator:
            return JsonResponse({'error': 'Unauthorized'}, status=401)

        # Delete the resource
        resource.delete()

    return JsonResponse({'status': 'ok'})


@csrf_exempt
def fetchUserFeed(request):
    if request.user.is_authenticated:
        feed = FeedItem.objects.filter(creator=request.user)
        data = [{
            "id": r.id,
            "content": r.content,
            "image": str(r.image) if r.image else None,  # Convert to string to get the relative path
            "resource_url": r.resource_url
        } for r in feed]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)
    
    
@csrf_exempt  
def addfeed(request):
    print(request)
    if request.user.is_authenticated:
        # Check if the user is a Mentor
        if request.method == 'POST':
            print("request data",request.POST.get('content'))
            
            print("request data",request.POST.get('resourceUrl'))
            
            content = request.POST.get('content')
            print(content)
         
            resource_url = request.POST.get('resourceUrl')
            creator = request.user
            image = request.FILES.get('image')
            print(content,resource_url)
            print('feed image', image)
            # Check if all required fields are provided
            if not content  or not resource_url:
                return JsonResponse({'status': 'error', 'message': 'All fields are required!'}, status=400)

            edu = FeedItem.objects.create(
                content=content,
                resource_url=resource_url,
                creator=creator,
                created_at=timezone.now(),
                image=image,
            )
            
            return JsonResponse({"status": "success", "message":"feed Added Successfully!"}, status=200)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)
    
    
@csrf_exempt
def delete_feed(request):
    if request.method == 'POST':
        # Get the resource ID from the request body
        data = json.loads(request.body)
        id = data.get('id')

        # Get the resource with the specified ID
        resource = FeedItem.objects.get(id=id)
        print(request.user)
        print(resource.creator)
        # Check if the requested resource belongs to the currently logged-in user
        if request.user != resource.creator:
            return JsonResponse({'error': 'Unauthorized'}, status=401)

        # Delete the resource
        resource.delete()
    return JsonResponse({'status': 'ok'})

  
@csrf_exempt
def get_feed_id(request , id):
    feed = FeedItem.objects.get(id=id)
    # Check if the requested resource belongs to the currently logged-in user
    if request.user != feed.creator:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    # Serialize the resource's data
    data = {"id": feed.id,"content": feed.content, "resource_url": feed.resource_url, "creator": feed.creator.email}
    
    return JsonResponse(data)


@csrf_exempt
def edit_feed(request):
    print(request)
    if request.user.is_authenticated:
        if request.method == 'POST':
            try:
                # print(request.FILES)
                content=request.POST.get('content')
                resource_url = request.POST.get('resource_url')
                image = request.FILES.get('profileImage')
                id = request.POST.get('id')
                print(image)
                user = FeedItem.objects.get(id=id)  # Fetch the user
                print(user)
                user.content =  content
                user.resource_url = resource_url
                user.image = image
                user.save()

                return JsonResponse({"status": "success", "message": "Feed updated successfully!"}, status=200)

            except CustomUser.DoesNotExist:
                return JsonResponse({"status": "failure", "message": "Feed does not exist"}, status=400)

            except Exception as e:
                return JsonResponse({"status": "failure", "message": str(e)}, status=400)

        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)

@csrf_exempt      
def contactUs(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            message = data.get('message')
            phone = data.get('phone')
            inquiryType = data.get('inquiryType')
            print(name, email, message, phone, inquiryType)
            if not name or not email or not message:
                return JsonResponse({'status': 'error', 'message': 'All fields are required!'}, status=400)

            mail_subject = ''
            if request.user.is_authenticated:
                User = get_user_model()
                try:
                    user = User.objects.get(email=email)
                    if user == request.user:
                        mail_subject = 'Contact Us Form - Authenticated User'
                    else:
                        return JsonResponse({'status': 'error', 'message': 'Unauthorized user'}, status=401)
                except User.DoesNotExist:
                    return JsonResponse({'status': 'error', 'message': 'Invalid user ID'}, status=400)
            else:
                mail_subject = 'Contact Us Form - Anonymous User'
                email = 'anon@taleofhumankind.com'  # Set a default email for anonymous users

            message = render_to_string('contact_us_mail.html', {
                'name': name,
                'email': email,
                'phone': phone,
                'inquiryType': inquiryType,
                'message': message,
            })

            email = EmailMessage(mail_subject, message, to=[os.environ.get("EMAIL_HOST_USER")])
            email.send()
            return JsonResponse({'status': 'success', 'message': 'Message sent successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
    


@csrf_exempt
def publicProfile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        id = data.get('id')
        
        if not id.isdigit():
            return JsonResponse({'status': 'failure', 'message': 'Invalid ID'}, status=400)

        try:
            user = CustomUser.objects.get(id=id, is_active=True)  # Check for is_active

            # Serialize the address and profile image
            address_data = serialize('json', [user.address])
            address = json.loads(address_data)[0]['fields']
            if user.profile_image:
                profile_image_url = user.profile_image.url[7:]  # Trim off the "/media" prefix
            else:
                profile_image_url = None

            user_data = {
                'id': user.id,
                'first_name' : user.first_name,
                'last_name' : user.last_name,
                'email': user.email,
                'user_type': user.user_type,
                'dob' : user.date_of_birth,
                'age': user.age,
                'address': address,
                'phone' : user.primary_phone_number,
                'profile_image': profile_image_url
            }
            return JsonResponse({'status': 'success', 'message': "Server: public profile received", 'user_data': user_data}, status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({'status': 'failure', 'message': 'User not found'}, status=400)

    


