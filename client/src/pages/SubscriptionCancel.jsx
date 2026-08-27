import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud-gray">
      <div className="max-w-2xl w-full mx-4">
        <Card className="text-center">
          <Card.Content className="py-12 px-6">
            {/* Cancel Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warning mb-6">
              <XCircle className="w-16 h-16 text-white" />
            </div>

            {/* Cancel Message */}
            <h1 className="text-4xl font-bold text-tena-black mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Your subscription payment was not completed
            </p>

            {/* Info */}
            <div className="bg-yellow-50 border border-warning rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-4">
                No charges were made to your account. You can try again anytime.
              </p>
              <p className="text-sm text-gray-600">
                If you encountered any issues, please contact our support team.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/dashboard/subscription')}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={ArrowLeft}
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>

            {/* Help */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-700">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-600">
                Contact us at{' '}
                <a href="mailto:support@tenaai.com" className="text-tena-yellow hover:underline">
                  support@tenaai.com
                </a>
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionCancel;
