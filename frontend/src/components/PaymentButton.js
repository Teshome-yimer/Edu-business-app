import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('your_publishable_key');

const PaymentButton = () => {
    const handleCheckout = async() => {
        try {
            const stripe = await stripePromise;
            const { data } = await axios.post('/api/payments/create-checkout-session', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const result = await stripe.redirectToCheckout({ sessionId: data.id });
            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    return ( <
        button onClick = { handleCheckout }
        className = "bg-blue-600 text-white px-4 py-2 rounded" >
        Upgrade to Paid Plan <
        /button>
    );
};

export default PaymentButton;