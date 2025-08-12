const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// create PaymentIntent
router.post('/create-payment-intent', async (req, res) => {
   try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount, 
        currency: "usd",
        payment_method_types: ["card"], // expand with apple pay later
        // automatic_payment_methods: { enabled: true }
        
    });
    
    console.log("Creating PaymentIntent for amount:", amount);

    res.json({
        clientSecret: paymentIntent.client_secret,
    });
    } catch(error) {
    console.error("Stripe error:", error);
    res.status(500).send({error: error.message });
    }

});

module.exports = router;