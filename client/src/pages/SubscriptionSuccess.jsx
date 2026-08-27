import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate verification (in production, verify with backend)
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cloud-gray">
        <Card className="max-w-md w-full mx-4">
          <Card.Content className="text-center py-12">
            <Loading size="lg" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-tena-black mb-2">
              Verifying Payment...
            </h3>
            <p className="text-gray-600">Please wait while we confirm your subscription</p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tena-yellow via-yellow-300 to-cloud-gray">
      <div className="max-w-2xl w-full mx-4">
        <Card className="text-center">
          <Card.Content className="py-12 px-6">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success mb-6">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-tena-black mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Your subscription has been activated
            </p>

            {/* Features Unlocked */}
            <div className="bg-cloud-gray rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-tena-yellow" />
                <h3 className="font-semibold text-tena-black">
                  Features Unlocked
                </h3>
              </div>
              <ul className="space-y-3 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited health assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority AI analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced health tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">24/7 priority support</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard/assessments/new')}
              >
                Start Assessment
              </Button>
            </div>

            {/* Receipt Info */}
            <p className="text-sm text-gray-600 mt-8">
              A receipt has been sent to your email.
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
