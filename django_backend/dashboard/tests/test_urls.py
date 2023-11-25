from django.test import SimpleTestCase
from django.urls import reverse, resolve
from dashboard.views import is_authenticated, user_signup, Education_resources, Fetchresources, getfeed, login_auth, logout


class TestUrls(SimpleTestCase):
    def test_login_auth_url_resolved(self):
        # Test that the login_auth URL resolves to the login_auth view function
        url = reverse('login_auth')
        self.assertEquals(resolve(url).func, login_auth)

    def test_user_signup_url_resolved(self):
        # Test that the user_signup URL resolves to the user_signup view function
        url = reverse('user_signup')
        self.assertEquals(resolve(url).func, user_signup)
    
    def test_logout_url_resolved(self):
        # Test that the logout URL resolves to the logout view function
        url = reverse('logout')
        self.assertEquals(resolve(url).func, logout)

    def test_is_authenticated_url_resolved(self):
        # Test that the is_authenticated URL resolves to the is_authenticated view function
        url = reverse('is_authenticated')
        self.assertEquals(resolve(url).func, is_authenticated)

    def test_EducationResource_url_resolved(self):
        # Test that the EducationResource URL resolves to the Education_resources view function
        url = reverse('EducationResource')
        self.assertEquals(resolve(url).func, Education_resources)

    def test_Fetchresources_url_resolved(self):
        # Test that the Fetchresources URL resolves to the Fetchresources view function
        url = reverse('Fetchresources')
        self.assertEquals(resolve(url).func, Fetchresources)

    def test_getfeed_url_resolved(self):
        # Test that the getfeed URL resolves to the getfeed view function
        url = reverse('feed')
        self.assertEquals(resolve(url).func, getfeed)