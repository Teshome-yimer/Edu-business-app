const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/authMiddleware');
const User = require('./models/User');
const router = express.Router();

router.post('/create-checkout-session', protect, async(req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Premium Plan' },
                    unit_amount: 999, // $9.99
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            customer_email: req.user.email, // Pre-fill email
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook to update user access after successful payment
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    // Verify webhook signature and update user's subscriptionPlan to 'paid'
    res.json({ received: true });
});