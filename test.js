import stripePackage from 'stripe';

// Replace with your actual Stripe secret key
const stripe = stripePackage('sk_test_51NWCRlSEvnwMKgrg1XttzhBjFiToEiA1Oi54lMXzLsbGH9AwaiCoRw5EroQLi5gV6OaIlxdAVnYOQgU7vUM39iMn0041Xk7GYt');

import express from 'express';
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_3440d28be2dec2369625720af639cfd3396ebc52726f184c88f0d89723c8f306";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
