// StripePay.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'; 

const stripePromise = loadStripe('pk_test_51PlQ1rRvNcL1ljqg8vK9y7Dh1TRaHafXgPj9jf0AviILtZGWb0Piw57sjbnoAdPhS3euWruzk0yYqGD4iP2Cq7RN00PHenoJdJ'); // Replace with your publishable key

const StripePay = () => {
    const options = {
        // clientSecret: 'your-client-secret-here', // Replace with actual client secret
        appearance: {
            /* Customize appearance if needed */
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
        </Elements>
    );
}

export default StripePay;
