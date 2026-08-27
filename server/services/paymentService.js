const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  constructor() {
    this.stripe = stripe;
  }

  // Get pricing configuration
  getPricingPlans() {
    return {
      basic: {
        name: 'Basic Plan',
        price: 9.99,
        priceInCents: 999,
        interval: 'month',
        features: [
          'Unlimited health assessments',
          'Priority AI processing',
          'Email support',
          'Assessment history',
          'PDF reports'
        ],
        limits: {
          assessmentsPerMonth: -1, // unlimited
          voiceUploadSize: 10485760 // 10MB
        }
      },
      premium: {
        name: 'Premium Plan',
        price: 19.99,
        priceInCents: 1999,
        interval: 'month',
        features: [
          'All Basic features',
          'Doctor consultation access',
          'Priority support',
          'Advanced analytics',
          'Family sharing (up to 4 members)',
          'Early access to new features'
        ],
        limits: {
          assessmentsPerMonth: -1, // unlimited
          voiceUploadSize: 52428800, // 50MB
          familyMembers: 4
        }
      },
      free: {
        name: 'Free Plan',
        price: 0,
        priceInCents: 0,
        interval: 'month',
        features: [
          '5 assessments per month',
          'Basic AI analysis',
          'Email support'
        ],
        limits: {
          assessmentsPerMonth: 5,
          voiceUploadSize: 5242880 // 5MB
        }
      }
    };
  }

  // Create product in Stripe
  async createProduct(planName) {
    try {
      const planConfig = this.getPricingPlans()[planName];

      const product = await this.stripe.products.create({
        name: planConfig.name,
        description: `TenaAI ${planConfig.name} - ${planConfig.features.join(', ')}`
      });

      return {
        success: true,
        data: product
      };

    } catch (error) {
      console.error('Create Product Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create price for product
  async createPrice(productId, planName) {
    try {
      const planConfig = this.getPricingPlans()[planName];

      const price = await this.stripe.prices.create({
        product: productId,
        unit_amount: planConfig.priceInCents,
        currency: 'usd',
        recurring: {
          interval: planConfig.interval
        }
      });

      return {
        success: true,
        data: price
      };

    } catch (error) {
      console.error('Create Price Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get customer by email
  async getCustomerByEmail(email) {
    try {
      const customers = await this.stripe.customers.list({
        email: email,
        limit: 1
      });

      if (customers.data.length > 0) {
        return {
          success: true,
          data: customers.data[0]
        };
      }

      return {
        success: false,
        message: 'Customer not found'
      };

    } catch (error) {
      console.error('Get Customer Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create customer portal session
  async createPortalSession(customerId, returnUrl) {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || `${process.env.CLIENT_URL}/subscription`
      });

      return {
        success: true,
        data: {
          url: session.url
        }
      };

    } catch (error) {
      console.error('Create Portal Session Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      return {
        success: true,
        data: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          plan: subscription.items.data[0].price.nickname || 'unknown'
        }
      };

    } catch (error) {
      console.error('Get Subscription Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId, newPriceId) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      
      const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId
        }],
        proration_behavior: 'always_invoice'
      });

      return {
        success: true,
        data: updatedSubscription
      };

    } catch (error) {
      console.error('Update Subscription Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get invoices for customer
  async getInvoices(customerId, limit = 10) {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        limit: limit
      });

      return {
        success: true,
        data: invoices.data.map(invoice => ({
          id: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: invoice.status,
          date: new Date(invoice.created * 1000),
          pdfUrl: invoice.invoice_pdf,
          hostedUrl: invoice.hosted_invoice_url
        }))
      };

    } catch (error) {
      console.error('Get Invoices Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refundData = {
        payment_intent: paymentIntentId
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.stripe.refunds.create(refundData);

      return {
        success: true,
        data: {
          id: refund.id,
          amount: refund.amount / 100,
          status: refund.status
        }
      };

    } catch (error) {
      console.error('Refund Payment Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature, secret) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
      return {
        success: true,
        event: event
      };
    } catch (error) {
      console.error('Webhook Verification Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate prorated amount for plan change
  calculateProration(oldPrice, newPrice, daysRemaining, totalDays) {
    const oldDailyRate = oldPrice / totalDays;
    const newDailyRate = newPrice / totalDays;
    const creditFromOldPlan = oldDailyRate * daysRemaining;
    const costForNewPlan = newDailyRate * daysRemaining;
    const amountDue = costForNewPlan - creditFromOldPlan;
    
    return {
      creditFromOldPlan: creditFromOldPlan.toFixed(2),
      costForNewPlan: costForNewPlan.toFixed(2),
      amountDue: amountDue.toFixed(2)
    };
  }

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}

module.exports = new PaymentService();
