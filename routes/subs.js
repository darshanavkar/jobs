import express from 'express';

import { requireSignIn} from '../middle/authMiddleware.js';
import { stripe } from '../utils/stripe.js';
import bodyParser from 'body-parser';
import userModel from '../models/userModel.js';

const router = express.Router();
/*router.use(bodyParser.json());
// ... (previous code remains unchanged)

// Custom middleware to handle raw body for the webhook route
router.use((req, res, next) => {
  // Check if the route is for the webhook
  if (req.path === "/api/v1/subs/webhook") {
    let rawData = '';
    req.on('data', (chunk) => {
      rawData += chunk;
    });
    req.on('end', () => {
      req.rawBody = rawData;
      next(); // Continue to the webhook route
    });
  } else {
    next(); // Continue to the next middleware for non-webhook routes
  }
});

// ... (rest of the code remains unchanged)

// This endpoint will receive the webhook events from Stripe
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.rawBody; // Access the raw request body as a Buffer from the custom middleware

  try {
    const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

    // Rest of the code for webhook handling (unchanged)
  } catch (err) {
    console.error('webhook error:', err.message);
    res.status(400).send(`webhook error: ${err.message}`);
  }
});

// Stripe webhook secret for local testing
const endpointSecret = "whsec_AUr5cAdaiczF2wCkx8LZrssVHv8flal9";
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  // Get the raw request body as a Buffer
  const rawBody = req.rawBody
  try {
    const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

    // Handle the specific event type
    switch (event.type) {
      case 'customer.subscription.created':
        // Subscription is successful, update the role to 1
        await handleSubscriptionSuccess(event.data.object.customer, res);
        break;
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated':
        // Subscription is canceled or refunded, update the role to 0
        await handleSubscriptionCancelled(event.data.object.customer);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error('webhook error:', err.message);
    res.status(400).send(`webhook error: ${err.message}`);
  }
});


// Function to handle successful subscription event
async function handleSubscriptionSuccess(customerId, res) {
  try {
    const userInstance = await userModel.findOne({ customer: customerId });
    if (userInstance) {
      console.log(userInstance);
      userInstance.role = 1;
      await userInstance.save();
      res.send(userInstance);
    }
  } catch (err) {
    console.error('Error handling subscription success:', err.message);
    res.status(500).json({ error: 'Error handling subscription success' });
  }
}

// Function to handle canceled or refunded subscription event
async function handleSubscriptionCancelled(customerId) {
  try {
    const userInstance = await userModel.findOne({ customer: customerId });
    if (userInstance) {
      userInstance.role = 0;
      await userInstance.save();
    }
  } catch (err) {
    console.error('Error handling subscription cancelled:', err.message);
  }
}
 */
///

///
router.get("/prices", async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      apiKey: process.env.STRIPE_SECRET_KEY
     
    });
   
    return res.json(prices);
  } catch (err) {
    console.error('Error fetching prices:', err.message);
    return res.status(500).json({ error: 'Failed to fetch prices' });
  }
 
});

router.post("/session", requireSignIn, async (req, res) => {
  try {
    const userInstance = await userModel.findOne({_id:req.user._id});
     
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1
        }
      ],
      success_url: "https://www.jobsea.asia/resume",
      cancel_url: "https://www.jobsea.asia/subs",
      customer: userInstance.customer,
      
    }, {
      apiKey: 'sk_test_51NWCRlSEvnwMKgrg1XttzhBjFiToEiA1Oi54lMXzLsbGH9AwaiCoRw5EroQLi5gV6OaIlxdAVnYOQgU7vUM39iMn0041Xk7GYt',
    });

    return res.json(session);
  } catch (err) {
    console.error('Error creating session:', err.message);
    return res.status(500).json({ error: 'Failed to create session' });
  }
});

export default router; 
