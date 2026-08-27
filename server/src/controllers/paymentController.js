import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount = 500, currency = 'etb', description = 'Tena AI Teleconsultation' } = req.body;

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to subunits
        currency: currency.toLowerCase(),
        description,
        automatic_payment_methods: { enabled: true },
      });

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // Mock payment processor for instant local testing without blocking API keys
    return res.status(200).json({
      success: true,
      clientSecret: `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 8)}`,
      paymentIntentId: `pi_mock_${Date.now()}`,
      message: 'Demo / Sandbox payment session initialized successfully.',
    });
  } catch (error) {
    console.error('[Stripe Payment Error]', error);
    return res.status(500).json({ success: false, message: error.message || 'Payment initiation failed' });
  }
};
