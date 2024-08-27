import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { originAPi } from '../../lib/store';


const StripePay = ({ PK_KEY,amount }) => {
    const stripePromise = loadStripe(PK_KEY);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Fetch the client secret from your backend
        fetch(originAPi+'/stripe/payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount:amount*100,paymentId:"" }),
        })
            .then((response) => response.json())
            .then((data) => {
                setClientSecret(data.clientSecret)
                
            })
            .catch((error) => console.error('Error fetching client secret:', error));
    }, [amount]);

    const options = {
        clientSecret, // Pass the clientSecret to the Elements provider
        appearance: {
            theme: 'stripe', // You can customize this theme or leave it default
        },
    };

    return clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
        </Elements>
    ) : (
        <div>Loading...</div> // Loading state while fetching clientSecret
    );
};

export default StripePay;