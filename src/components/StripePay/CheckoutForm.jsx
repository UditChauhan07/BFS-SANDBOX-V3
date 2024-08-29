import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Styles from "./Styles.module.css";
import Swal from 'sweetalert2';

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
                return_url: 'http://localhost:3000/order/complete',
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
        <form onSubmit={handleSubmit} className={Styles.container}>
            <PaymentElement />
            <div className={Styles.btnHolder}>
                <button type="submit" disabled={!stripe} className={Styles.btn}>
                    Pay
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;
