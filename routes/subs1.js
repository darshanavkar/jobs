import express, { response } from 'express';
import userModel from '../models/userModel.js';
import { stripe } from '../utils/stripe.js'; // Import stripe directly
import { requireSignIn, isAdmin } from '../middle/authMiddleware.js';
import nodemailer from 'nodemailer';
const router = express.Router();


router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    let event;
    const endpointSecret = 'whsec_AUr5cAdaiczF2wCkx8LZrssVHv8flal9';

    if (endpointSecret) {
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log('⚠️  Webhook signature verification failed.', err.message);
        return response.sendStatus(400);
      }
    } else {
      event = JSON.parse(request.body);
    }

    let subscription;
    var status;

    switch (event.type) {
      case 'customer.subscription.trial_will_end':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
         

      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
         handleSubscriptionDeleted(status,subscription.customer);
        
        break;

      case 'customer.subscription.created':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        console.log(subscription.customer);
          handleSubscriptionCreated(subscription.customer,subscription.plan);

        break;

      case 'customer.subscription.updated':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
         handleSubscriptionUpdated(subscription.customer); // Define and call this method
        break;

      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.sendStatus(200);
   
    
  }
);

// Example subscription status handlers

const handleSubscriptionCreated = async (customerId,plan) => {
  

    // Logic to handle a newly activated subscription
    try {
      const user = await userModel.findOneAndUpdate(
        { customer: customerId },
        { role: 1 },
        { new: true }
      );

      if (!user) {
        console.log(`User not found for customer ID: ${customerId}`);
      } else {
        console.log(`User role updated to 1 for customer ID: ${customerId}`);
         // Send email notification
         sendSubscriptionNotification(user.email, plan);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
   
    // You can perform actions like updating user data, sending notifications, etc.
  
};

const handleSubscriptionDeleted = async (status,customerId) => {
  if (status === 'canceled') {
    // Logic to handle a canceled subscription
    console.log('Subscription canceled.');
   
    try {
      const user = await userModel.findOneAndUpdate(
        { customer: customerId },
        { role: 0 },
        { new: true }
      );

      if (!user) {
        console.log(`User not found for customer ID: ${customerId}`);
      } else {
        console.log(`User role updated to 0 for customer ID: ${customerId}`);
        sendSubscriptionCancelledEmail(user.email, user.name);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }

  }
    
    // You can perform actions like updating user data, removing access, etc.
  };

const handleSubscriptionUpdated = async (status,customerId) => {
  if (status === 'active') {
    // Logic to handle an updated active subscription
    console.log('Subscription updated and still active.');
  try {
      const user = await userModel.findOneAndUpdate(
        { customer: customerId },
        { role: 1 },
        { new: true }
      );

      if (!user) {
        console.log(`User not found for customer ID: ${customerId}`);
      } else {
        console.log(`User role updated to 1 for customer ID: ${customerId}`);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
    // You can perform actions like updating user data, adjusting benefits, etc.
  }
};

// Function to send email notification
//when subscription is created
const sendSubscriptionNotification = (recipientEmail, plan) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
  auth: {
    user: "sameer@neuetrinostech.com", // your email address
    pass: "dtjwyxropsccpokv", // your email password
    },
  });

  const mailOptions = {
    from: 'sameer@neuetrinostech.com',
    to: recipientEmail,
    subject: '🎉 Congratulations! Your Subscription is Live 🚀',
    html: `
      <h1>Welcome to the Journey!</h1>
      <p>Congratulations! Your subscription has been successfully activated.</p>
      <p>You're now a valued member of our community. Get ready to unlock amazing benefits and experiences that await you:</p>
      <h2>Your Subscription Plan: ${plan.nickname}</h2>
      <p>Amount Paid: ${plan.amount / 100} ${plan.currency}</p>
      <p>Stay tuned for exciting updates and resources coming your way. Thank you for choosing us!</p>
      <p>Enjoy the ride,</p>
      <p>The JobSea Team</p>
      <p>P.S. Remember, the best is yet to come!</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

//subscrition mailed canceld or deleted 
const sendSubscriptionCancelledEmail = (recipientEmail, recipientName) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sameer@neuetrinostech.com", // your email address
      pass: "dtjwyxropsccpokv", // your email password
    },
  });

  const mailOption = {
    from: 'sameer@neuetrinostech.com',
    to: recipientEmail,
    subject: '👋 We are Sad to See You Go',
    html: `
      <h1>Farewell, ${recipientName}!</h1>
      <p>Dear ${recipientName},</p>
      <p>We're sorry to see you go, but we understand that sometimes things change.</p>
      <p>Your subscription has been expired, and you won't be charged any further. If you ever decide to come back, we'll be here with open arms.</p>
      <p>Thank you for being part of our community. We wish you all the best on your journey ahead!</p>
      <p>Best regards,</p>
      <p>The JobSea Team</p>
    `,
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};


export default router;
