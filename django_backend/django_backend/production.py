from .settings import *

DEBUG = False
ALLOWED_HOSTS = ['54.83.17.157', 'test-website.taleofhumankind.com', '127.0.0.1', 'localhost', '127.0.0.1:8000']

# Session
SESSION_COOKIE_SECURE = False  # True in production if using HTTPS