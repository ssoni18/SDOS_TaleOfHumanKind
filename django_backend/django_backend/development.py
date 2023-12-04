from .settings import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# CORS
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
]

# Session
SESSION_COOKIE_SECURE = False
