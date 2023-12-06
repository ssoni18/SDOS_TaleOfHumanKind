from django.utils import timezone
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import CustomUser, Address, EducationalResource, FeedItem ,Like, Campaign
import os
from django.contrib.auth import logout as auth_logout
from django.core.serializers import serialize
from django.core.exceptions import ValidationError
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.shortcuts import redirect


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
            current_site = get_current_site(request)
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
            
            address_data = serialize('json', [user.address])
            address = json.loads(address_data)[0]['fields']
            
            user_data = {
                'first_name' : user.first_name,
                'last_name' : user.last_name,
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
def get_user_role(request):
    user_type = request.session.get('user_type', None)
    return JsonResponse({'user_type': user_type})


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
            return redirect(f'{os.environ.get("REACT_APP_API_URL")}/Login?activated=true')
        else:
            return redirect(f'{os.environ.get("REACT_APP_API_URL")}/Login?activated=false')
    except(TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        return redirect(f'{os.environ.get("REACT_APP_API_URL")}/Login?activated=false')


    
@csrf_exempt
def fetchMentors(request):
    if request.user.is_authenticated:
        mentors = CustomUser.objects.filter(user_type="Mentor")
        mentors_data = {mentor.email: mentor.first_name for mentor in mentors}
        response_data = {'mentors': mentors_data}
        return JsonResponse(response_data)
    else:
        return JsonResponse({'is_authenticated': False})


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
        # Check if the user is a Mentor
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
                image=image,

            )
            
            return JsonResponse({"status": "success", "message":"Resource Added Successfully!"}, status=200)
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated!'}, status=401)
    

@csrf_exempt
def fetchEducationalResources(request):
    if request.method == 'GET':
        resources = EducationalResource.objects.all()
        resources_list = list(resources.values('title', 'content_type', 'resource_url', 'creator__email', 'created_date', 'updated_date', 'image'))
        return JsonResponse(resources_list, safe=False)

@csrf_exempt
def fetchCampaigns(request):
    if request.method == 'GET':
        # campaign = Campaign.objects.filter(isApproved=True, goal_amount__gt=0)
        campaign = Campaign.objects.filter(isApproved=True)
        campaign_list = list(campaign.values('title', 'description', 'mentor__first_name', 'changemaker__first_name', 'image', 'goal_amount', 'current_amount'))
        return JsonResponse(campaign_list, safe=False)

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
