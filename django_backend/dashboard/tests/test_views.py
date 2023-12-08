from django.test import TestCase, Client
from django.urls import reverse
from dashboard.models import Campaign, Donation, EducationalResource, CustomUser, Address, SocialMediaHandle

class TestViews(TestCase):
    def test_is_authenticated_GET(self):
        # Test when user is authenticated
        client = Client()
        # Set up authenticated user
        user = CustomUser.objects.create(username='testuser', email='test@example.com')
        client.force_login(user)
        
        response = client.get(reverse('is_authenticated'))

        self.assertEquals(response.status_code, 200)
        self.assertIn("is_authenticated", response.json())
        self.assertIsInstance(response.json()["is_authenticated"], bool)

    def test_is_authenticated_GET_unauthenticated(self):
        # Test when user is not authenticated
        client = Client()
        
        response = client.get(reverse('is_authenticated'))

        self.assertEquals(response.status_code, 200)
        self.assertIn("is_authenticated", response.json())
        self.assertIsInstance(response.json()["is_authenticated"], bool)

    def test_user_signup_POST(self):
        # Test user signup with valid data
        client = Client()
        data = {
            'email': 'test@example.com',
            'firstName': 'John',
            'lastName': 'Doe',
            'phoneNumber': '1234567890',
            'selectedRole': 'student',
            'selectedQualification': 'bachelor',
            'password': 'testpassword'
        }
        
        response = client.post(reverse('user_signup'), data=data)

        self.assertEquals(response.status_code, 200)
        self.assertIn("status", response.json())
        self.assertEquals(response.json()["status"], "success")

    def test_user_signup_POST_invalid_data(self):
        # Test user signup with invalid data
        client = Client()
        data = {
            'email': 'test@example.com',
            'firstName': 'John',
            'lastName': 'Doe',
            'phoneNumber': '1234567890',
            'selectedRole': 'student',
            'selectedQualification': 'bachelor',
            'password': 'testpassword'
        }
        
        response = client.post(reverse('user_signup'), data=data)

        self.assertEquals(response.status_code, 400)
        self.assertIn("status", response.json())
        self.assertEquals(response.json()["status"], "failure")

    def test_user_signup_POST_duplicate_email(self):
        # Test user signup with duplicate email
        client = Client()
        data = {
            'email': 'test@example.com',
            'firstName': 'John',
            'lastName': 'Doe',
            'phoneNumber': '1234567890',
            'selectedRole': 'student',
            'selectedQualification': 'bachelor',
            'password': 'testpassword'
        }
        # Create a user with the same email
        CustomUser.objects.create(username='existinguser', email='test@example.com')
        
        response = client.post(reverse('user_signup'), data=data)

        self.assertEquals(response.status_code, 409)
        self.assertIn("status", response.json())
        self.assertEquals(response.json()["status"], "failure")

    def test_login_auth_POST(self):
        # Test login authentication with valid credentials
        client = Client()
        data = {
            'email': 'vens@duck.com',
            'password': '12345'
        }
        # Create a user with the same email and password
        user = CustomUser.objects.create(username='vens@duck.com', email='vens@duck.com')
        user.set_password('12345')
        user.save()
        
        response = client.post(reverse('login_auth'), data=data)

        self.assertEquals(response.status_code, 200)
        self.assertIn("status", response.json())
        self.assertEquals(response.json()["status"], "ok")

    def test_login_auth_POST_invalid_credentials(self):
        # Test login authentication with invalid credentials
        client = Client()
        data = {
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        
        response = client.post(reverse('login_auth'), data=data)

        self.assertEquals(response.status_code, 200)
        self.assertIn("status", response.json())
        self.assertEquals(response.json()["status"], "error")

    def test_logout_GET_authenticated(self):
        # Test logout when user is authenticated
        client = Client()
        # Set up authenticated user
        user = CustomUser.objects.create(username='testuser', email='test@example.com')
        client.force_login(user)
        
        response = client.get(reverse('logout'))
        
        self.assertEquals(response.status_code, 200)
        self.assertIn("status", response.json())
        self.assertEquals(response.json()["status"], "ok")
        self.assertIn("message", response.json())
        self.assertEquals(response.json()["message"], "Logged out successfully")