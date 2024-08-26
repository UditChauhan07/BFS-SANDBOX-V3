import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet.
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Optional: Return URL where the customer should be redirected after payment
                return_url: 'https://your-website.com/order/complete',
            },
        });

        if (error) {
            // Show error to your customer
            console.error('Payment error:', error.message);
        } else {
            console.log('Payment successful!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
        </form>
    );
};

export default CheckoutForm;
