from .settings import *

DEBUG = False
ALLOWED_HOSTS = ['test-website.taleofhumankind.com']

# CORS
CORS_ALLOWED_ORIGINS = [
    'http://test-website.taleofhumankind.com'
]
CORS_ORIGIN_WHITELIST = [
    'http://test-website.taleofhumankind.com'
]

# Session
SESSION_COOKIE_SECURE = True
