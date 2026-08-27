const axios = require('axios');

class EmailService {
  constructor() {
    this.apiKey = process.env.TESTMAIL_API_KEY;
    this.namespace = process.env.TESTMAIL_NAMESPACE || 'tenaai';
    this.apiUrl = 'https://api.testmail.app/api/json';
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    try {
      const emailData = {
        to: user.email,
        from: `noreply@${this.namespace}.testmail.app`,
        subject: 'Welcome to TenaAI',
        html: this.getWelcomeEmailTemplate(user),
        text: `Welcome to TenaAI, ${user.firstName}! Your account has been created successfully.`
      };

      await this.sendEmail(emailData);

      return {
        success: true,
        message: 'Welcome email sent'
      };

    } catch (error) {
      console.error('Send Welcome Email Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send assessment notification
  async sendAssessmentNotification(user, assessment) {
    try {
      const emailData = {
        to: user.email,
        from: `noreply@${this.namespace}.testmail.app`,
        subject: 'Your TenaAI Health Assessment is Ready',
        html: this.getAssessmentEmailTemplate(user, assessment),
        text: `Your health assessment (${assessment.assessmentId}) is ready. Confidence: ${assessment.aiAnalysis.confidence}%`
      };

      await this.sendEmail(emailData);

      return {
        success: true,
        message: 'Assessment notification sent'
      };

    } catch (error) {
      console.error('Send Assessment Email Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send emergency alert
  async sendEmergencyAlert(user, assessment) {
    try {
      const emailData = {
        to: user.email,
        from: `emergency@${this.namespace}.testmail.app`,
        subject: 'URGENT: TenaAI Emergency Assessment',
        html: this.getEmergencyEmailTemplate(user, assessment),
        text: `URGENT: Your assessment shows emergency symptoms. Please seek immediate medical attention.`
      };

      await this.sendEmail(emailData);

      return {
        success: true,
        message: 'Emergency alert sent'
      };

    } catch (error) {
      console.error('Send Emergency Email Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send payment confirmation
  async sendPaymentConfirmation(user, payment) {
    try {
      const emailData = {
        to: user.email,
        from: `billing@${this.namespace}.testmail.app`,
        subject: 'Payment Confirmation - TenaAI',
        html: this.getPaymentEmailTemplate(user, payment),
        text: `Payment confirmed for ${payment.plan} plan. Amount: $${payment.amount}`
      };

      await this.sendEmail(emailData);

      return {
        success: true,
        message: 'Payment confirmation sent'
      };

    } catch (error) {
      console.error('Send Payment Email Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send subscription cancelled
  async sendSubscriptionCancelled(user) {
    try {
      const emailData = {
        to: user.email,
        from: `billing@${this.namespace}.testmail.app`,
        subject: 'Subscription Cancelled - TenaAI',
        html: this.getSubscriptionCancelledTemplate(user),
        text: 'Your TenaAI subscription has been cancelled. You now have a free account.'
      };

      await this.sendEmail(emailData);

      return {
        success: true,
        message: 'Cancellation email sent'
      };

    } catch (error) {
      console.error('Send Cancellation Email Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generic send email method
  async sendEmail(emailData) {
    try {
      // For TestMail, we just log the email
      // In production, use actual SMTP or email service
      console.log('📧 Email sent:', {
        to: emailData.to,
        subject: emailData.subject
      });

      // TestMail API call would go here
      // For now, we're just simulating

      return {
        success: true,
        messageId: `msg_${Date.now()}`
      };

    } catch (error) {
      console.error('Send Email Error:', error);
      throw error;
    }
  }

  // Email Templates

  getWelcomeEmailTemplate(user) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111111; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #F8D743; padding: 20px; text-align: center; }
    .header h1 { margin: 0; color: #111111; }
    .content { background: #ffffff; padding: 30px; }
    .button { display: inline-block; padding: 12px 30px; background: #111111; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to TenaAI</h1>
    </div>
    <div class="content">
      <h2>Hello ${user.firstName},</h2>
      <p>Your TenaAI account has been created successfully.</p>
      <p>TenaAI provides AI-powered health assessments in your preferred language. Record your symptoms and get instant medical insights.</p>
      <p><strong>Your Account Details:</strong></p>
      <ul>
        <li>Email: ${user.email}</li>
        <li>Plan: ${user.subscription.plan}</li>
        <li>Language: ${user.language}</li>
      </ul>
      <a href="${process.env.CLIENT_URL}/dashboard" class="button">Go to Dashboard</a>
      <p>If you have questions, contact our support team.</p>
    </div>
    <div class="footer">
      <p>TenaAI - Act Faster. Care Better.</p>
      <p>This email was sent to ${user.email}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  getAssessmentEmailTemplate(user, assessment) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111111; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #F8D743; padding: 20px; text-align: center; }
    .content { background: #ffffff; padding: 30px; }
    .confidence { font-size: 48px; font-weight: bold; color: #111111; text-align: center; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 30px; background: #111111; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Assessment Ready</h1>
    </div>
    <div class="content">
      <h2>Hello ${user.firstName},</h2>
      <p>Your health assessment is complete.</p>
      <p><strong>Assessment ID:</strong> ${assessment.assessmentId}</p>
      <div class="confidence">${assessment.aiAnalysis.confidence}%</div>
      <p style="text-align: center;">Confidence Score</p>
      <p><strong>Summary:</strong></p>
      <p>${assessment.aiAnalysis.clinicalSummary.substring(0, 200)}...</p>
      <a href="${process.env.CLIENT_URL}/assessments/${assessment._id}" class="button">View Full Assessment</a>
      <p><em>This is an AI assessment. Consult a healthcare professional for medical advice.</em></p>
    </div>
    <div class="footer">
      <p>TenaAI - Act Faster. Care Better.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  getEmergencyEmailTemplate(user, assessment) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111111; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #FF0000; padding: 20px; text-align: center; color: #ffffff; }
    .content { background: #ffffff; padding: 30px; border: 3px solid #FF0000; }
    .button { display: inline-block; padding: 12px 30px; background: #FF0000; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>URGENT: Emergency Assessment</h1>
    </div>
    <div class="content">
      <h2>IMMEDIATE ACTION REQUIRED</h2>
      <p>Your symptoms indicate a potential emergency.</p>
      <p><strong>Assessment ID:</strong> ${assessment.assessmentId}</p>
      <p><strong>Urgency:</strong> ${assessment.aiAnalysis.urgencyLevel.toUpperCase()}</p>
      <h3>What to do now:</h3>
      <ul>
        <li>Call emergency services (911 or local emergency number)</li>
        <li>Seek immediate medical attention</li>
        <li>Do not wait for symptoms to worsen</li>
      </ul>
      <a href="${process.env.CLIENT_URL}/assessments/${assessment._id}" class="button">View Assessment</a>
      <p><strong>Emergency Contact:</strong> 911 (USA) or your local emergency number</p>
    </div>
    <div class="footer">
      <p>TenaAI Emergency Alert System</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  getPaymentEmailTemplate(user, payment) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111111; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #F8D743; padding: 20px; text-align: center; }
    .content { background: #ffffff; padding: 30px; }
    .amount { font-size: 36px; font-weight: bold; color: #111111; text-align: center; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Confirmed</h1>
    </div>
    <div class="content">
      <h2>Hello ${user.firstName},</h2>
      <p>Your payment has been processed successfully.</p>
      <div class="amount">$${payment.amount}</div>
      <p><strong>Plan:</strong> ${payment.plan.toUpperCase()}</p>
      <p><strong>Billing Period:</strong> Monthly</p>
      <p>Your subscription is now active. Enjoy unlimited assessments and priority support.</p>
      <p>Next billing date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
    </div>
    <div class="footer">
      <p>TenaAI Billing</p>
      <p>Questions? Contact support@tenaai.com</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  getSubscriptionCancelledTemplate(user) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111111; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #E7E7E2; padding: 20px; text-align: center; }
    .content { background: #ffffff; padding: 30px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Subscription Cancelled</h1>
    </div>
    <div class="content">
      <h2>Hello ${user.firstName},</h2>
      <p>Your TenaAI subscription has been cancelled.</p>
      <p>You now have a free account with limited features:</p>
      <ul>
        <li>5 assessments per month</li>
        <li>Basic AI analysis</li>
        <li>Email support</li>
      </ul>
      <p>You can reactivate your subscription anytime from your account settings.</p>
      <p>We hope to see you back soon!</p>
    </div>
    <div class="footer">
      <p>TenaAI Team</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

module.exports = new EmailService();
