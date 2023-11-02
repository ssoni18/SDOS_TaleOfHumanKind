import re


# input validator functions to check if the incoming data from API calls is valid

# Further improve!
def validate_email(email):
    if not email:
        return False
    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if not re.match(email_regex, email):
        return False
    return True

def validate_password(password):
    if not password or len(password) < 8:
        return False
    return True

def validate_firstname(firstname):
    if not firstname or len(firstname) < 2:
        return False
    return True

def validate_lastname(lastname):
    if not lastname or len(lastname) < 2:
        return False
    return True

def validate_phonenumber(phoneNumber):
    if not phoneNumber or len(phoneNumber) != 10:
        return False
    return True

def validate_selectedRole(selectedRole):
    if not selectedRole or selectedRole not in ['Mentor', 'Changemaker', 'Leader']:
        return False
    return True

def validate_selectedQualification(selectedQualification):
    if not selectedQualification or selectedQualification not in ['High School', 'Bachelor\'s Degree', 'Master\'s Degree']:
        return False
    return True

