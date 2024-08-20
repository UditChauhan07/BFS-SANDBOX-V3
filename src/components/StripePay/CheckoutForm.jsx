// CheckoutForm.js
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { originAPi } from '../../lib/store';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setErrorMessage('CardElement is not available.');
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });
        console.log({error,paymentMethod});
        

        if (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.message);
            return;
        }

        try {
            const response = await fetch(originAPi+'/payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_method_id: paymentMethod.id,
                    amount: 1000 // Amount in cents, adjust as needed
                }),
            });

            const paymentIntentResponse = await response.json();
            const { clientSecret } = paymentIntentResponse;

            const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

            if (confirmError) {
                console.error('Payment confirmation error:', confirmError);
                setErrorMessage(confirmError.message);
            } else {
                console.log('Payment successful!');
                setErrorMessage(null);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setErrorMessage('An error occurred during the payment process.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || !elements}>
                Pay
            </button>
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    );
};

export default CheckoutForm;
