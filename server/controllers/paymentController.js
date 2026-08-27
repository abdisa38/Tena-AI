const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');

// @desc    Create Stripe checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body; // 'basic' or 'premium'

    if (!['basic', 'premium'].includes(plan)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid plan selected'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Define pricing (in cents)
    const pricing = {
      basic: {
        amount: 999, // $9.99
        name: 'TenaAI Basic Plan',
        description: 'Unlimited assessments with priority support'
      },
      premium: {
        amount: 1999, // $19.99
        name: 'TenaAI Premium Plan',
        description: 'All features including doctor consultations'
      }
    };

    const selectedPlan = pricing[plan];

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.subscription.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user._id.toString()
        }
      });
      stripeCustomerId = customer.id;
      user.subscription.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description
            },
            unit_amount: selectedPlan.amount,
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
      metadata: {
        userId: user._id.toString(),
        plan: plan
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        sessionId: session.id,
        url: session.url
      }
    });

  } catch (error) {
    console.error('Create Checkout Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};

// @desc    Handle Stripe webhooks
// @route   POST /api/payments/webhook
// @access  Public (Stripe verifies)
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      status: 'success',
      results: payments.length,
      data: {
        payments
      }
    });

  } catch (error) {
    console.error('Get Payment History Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// @desc    Cancel subscription
// @route   POST /api/payments/cancel-subscription
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        status: 'error',
        message: 'No active subscription found'
      });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);

    // Update user subscription status
    user.subscription.status = 'cancelled';
    user.subscription.plan = 'free';
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel Subscription Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

// ============ Webhook Helper Functions ============

async function handleCheckoutCompleted(session) {
  const userId = session.metadata.userId;
  const plan = session.metadata.plan;
  const subscriptionId = session.subscription;

  // Update user subscription
  await User.findByIdAndUpdate(userId, {
    'subscription.plan': plan,
    'subscription.status': 'active',
    'subscription.stripeSubscriptionId': subscriptionId,
    'subscription.startDate': new Date(),
    'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });

  // Create payment record
  await Payment.create({
    user: userId,
    stripePaymentId: session.payment_intent,
    amount: session.amount_total / 100, // Convert from cents
    plan: plan,
    status: 'succeeded'
  });

  console.log(`Subscription activated for user ${userId}, plan: ${plan}`);
}

async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  
  // Find user by Stripe customer ID
  const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
  
  if (user) {
    user.subscription.status = subscription.status;
    await user.save();
    console.log(`Subscription updated for user ${user._id}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  
  // Find user and downgrade to free
  const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
  
  if (user) {
    user.subscription.plan = 'free';
    user.subscription.status = 'inactive';
    user.subscription.stripeSubscriptionId = null;
    await user.save();
    console.log(`Subscription cancelled for user ${user._id}`);
  }
}

async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  
  // Find user
  const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
  
  if (user) {
    // Create payment record
    await Payment.create({
      user: user._id,
      stripePaymentId: invoice.payment_intent,
      amount: invoice.amount_paid / 100,
      plan: user.subscription.plan,
      status: 'succeeded'
    });

    // Extend subscription end date
    user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    console.log(`Payment succeeded for user ${user._id}`);
  }
}

async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;
  
  // Find user
  const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
  
  if (user) {
    // Create failed payment record
    await Payment.create({
      user: user._id,
      stripePaymentId: invoice.payment_intent,
      amount: invoice.amount_due / 100,
      plan: user.subscription.plan,
      status: 'failed'
    });

    // TODO: Send email notification about failed payment
    console.log(`Payment failed for user ${user._id}`);
  }
}
