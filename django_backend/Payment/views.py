import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def process_payment(request):
    # import ipdb;ipdb.set_trace()
    print(request.POST)
    if request.method == 'POST':
        post_data = json.loads(request.body)
        token = post_data.get('token')
        print(token)
        try:
            # Create a customer on Stripe using the token
            customer = stripe.Customer.create(payment_method=token , 
                            invoice_settings={'default_payment_method': token})
            print("customer" , customer)
            # stripe.PaymentIntent.create()
            # Create a charge using the customer's id
            PaymentIntent = stripe.PaymentIntent.create(
                amount=1000,  # Amount in cents (adjust this as needed)
                currency='usd',
                description='Example charge',
                customer=customer.id,
            )
            return JsonResponse({'message': 'Payment successful'})
        except stripe.error.CardError as e:
            return JsonResponse({'error': e.user_message}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)
