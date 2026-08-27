import { useState } from 'react';
import { Check, CreditCard, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Badge from '@components/ui/Badge';
import Modal from '@components/ui/Modal';
import useAuthStore from '@stores/useAuthStore';
import { paymentAPI } from '@services/api';

const Subscription = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        '5 assessments per month',
        'Basic AI analysis',
        'Email support',
        'Assessment history',
        'Multi-language support'
      ],
      limitations: [
        'Limited to 5 assessments',
        'No PDF reports',
        'No doctor consultations'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      popular: true,
      features: [
        'Unlimited assessments',
        'Priority AI processing',
        'Email support',
        'PDF reports',
        'Advanced analytics',
        'Assessment history',
        'Multi-language support'
      ],
      limitations: [
        'No doctor consultations',
        'No family sharing'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      features: [
        'All Basic features',
        'Doctor consultations',
        'Priority support',
        'Advanced analytics',
        'Family sharing (4 members)',
        'Early access to features',
        'PDF reports',
        'Unlimited assessments'
      ],
      limitations: []
    }
  ];

  const currentPlan = user?.subscription?.plan || 'free';

  const handleSubscribe = async (planId) => {
    if (planId === 'free' || planId === currentPlan) return;

    setLoading(true);
    try {
      const response = await paymentAPI.createCheckout({ plan: planId });
      
      // Redirect to Stripe checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      await paymentAPI.cancelSubscription();
      toast.success('Subscription cancelled successfully');
      setCancelModalOpen(false);
      // Refresh user data
      window.location.reload();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-tena-black mb-2">Subscription & Billing</h1>
        <p className="text-gray-600">Choose the plan that fits your needs</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8 bg-gradient-to-r from-tena-yellow to-yellow-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-tena-black mb-1">Current Plan</p>
            <h3 className="text-2xl font-bold text-tena-black capitalize">
              {currentPlan} Plan
            </h3>
            <p className="text-tena-black mt-2">
              {currentPlan === 'free' ? '5 assessments remaining this month' : 'Unlimited assessments'}
            </p>
          </div>
          {currentPlan !== 'free' && (
            <Button 
              variant="outline" 
              onClick={() => setCancelModalOpen(true)}
              className="bg-white"
            >
              Cancel Plan
            </Button>
          )}
        </div>
      </Card>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative ${plan.popular ? 'border-2 border-tena-yellow' : ''} ${plan.id === currentPlan ? 'bg-cloud-gray' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tena-yellow text-tena-black px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
            )}
            
            {plan.id === currentPlan && (
              <div className="absolute top-4 right-4">
                <Badge variant="success">Current</Badge>
              </div>
            )}

            <Card.Header>
              <Card.Title>{plan.name}</Card.Title>
              <div className="mt-4">
                <span className="text-4xl font-bold text-tena-black">
                  ${plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </Card.Header>

            <Card.Content>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.limitations.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Not included:</p>
                  <ul className="space-y-2">
                    {plan.limitations.map((limit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-500">{limit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Content>

            <Card.Footer>
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full"
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || plan.id === currentPlan}
                loading={loading}
              >
                {plan.id === currentPlan ? 'Current Plan' : plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {/* Billing Info */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <Card.Title>Billing Information</Card.Title>
          </div>
          <Card.Description>Payment method and history</Card.Description>
        </Card.Header>
        <Card.Content>
          {currentPlan === 'free' ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active subscription</p>
              <p className="text-sm mt-1">Upgrade to access payment history</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                Your subscription will renew on{' '}
                <span className="font-medium text-tena-black">
                  {user?.subscription?.endDate 
                    ? new Date(user.subscription.endDate).toLocaleDateString() 
                    : 'N/A'}
                </span>
              </p>
              <Button variant="ghost" size="sm" className="mt-4">
                View Payment History
              </Button>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)}>
        <Modal.Header onClose={() => setCancelModalOpen(false)}>
          <Modal.Title>Cancel Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">
            Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.
          </p>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Your subscription will remain active until{' '}
              <span className="font-medium">
                {user?.subscription?.endDate 
                  ? new Date(user.subscription.endDate).toLocaleDateString() 
                  : 'N/A'}
              </span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setCancelModalOpen(false)}>
            Keep Subscription
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCancelSubscription}
            loading={loading}
          >
            Cancel Subscription
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Subscription;
