import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


function Payment() {
    const stripe = useStripe();
    const elements = useElements();

    const makePayment = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[error]', error);
        } else {
          console.log(paymentMethod.id)
            axios.post('http://localhost:8000/process_payment/', {

                token: paymentMethod.id
            })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
        }
    };

    return (
        <div className="container">
            <h2>Payment Page</h2>
            <form onSubmit={makePayment}>
                <CardElement />
                <Button variant="primary" type="submit" disabled={!stripe}>Make Payment</Button>
            </form>
        </div>
    );
}

export default Payment;
