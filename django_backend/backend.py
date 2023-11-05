from django.contrib.auth.backends import ModelBackend                                                                                                                        
from django.contrib.auth import get_user_model 
import bcrypt                                                                                         

class CustomUserModelBackend(ModelBackend):
    def user_can_authenticate(self, user):
        return super().user_can_authenticate(user)

    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def authenticate(self, request, email=None, password=None, **kwargs):
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                return user
        except User.DoesNotExist:
            print('user does not exist')
            return None
            