from .settings import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '54.83.17.157', 'test-website.taleofhumankind.com']

# CORS
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
]
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# Session
SESSION_COOKIE_SECURE = False
