import { Link } from 'react-router-dom';
import { SignUpButton } from '@clerk/clerk-react';
import { Activity, BarChart3, Shield, Globe } from 'lucide-react';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-tena-yellow to-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-tena-black mb-6">
              Act Faster.<br />Care Better.
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              AI-powered health assessment in your language. Get instant medical insights and professional care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <Button variant="primary" size="lg">
                  Get Started Free
                </Button>
              </SignUpButton>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-tena-black mb-4">
              Professional Healthcare Analysis
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology combined with medical expertise to provide accurate health assessments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <Activity className="w-12 h-12 text-tena-yellow mb-4" />
              <Card.Title>Voice Recording</Card.Title>
              <Card.Description>
                Record symptoms in your preferred language.
              </Card.Description>
            </Card>

            <Card>
              <BarChart3 className="w-12 h-12 text-tena-yellow mb-4" />
              <Card.Title>AI Analysis</Card.Title>
              <Card.Description>
                Get instant health insights with 94% confidence.
              </Card.Description>
            </Card>

            <Card>
              <Shield className="w-12 h-12 text-tena-yellow mb-4" />
              <Card.Title>Secure & Private</Card.Title>
              <Card.Description>
                Your health data is encrypted and protected.
              </Card.Description>
            </Card>

            <Card>
              <Globe className="w-12 h-12 text-tena-yellow mb-4" />
              <Card.Title>Multi-Language</Card.Title>
              <Card.Description>
                English, Amharic, and Afaan Oromoo supported.
              </Card.Description>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-tena-black text-tena-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust TenaAI for their health assessments.
          </p>
          <SignUpButton mode="modal">
            <Button variant="secondary" size="lg">
              Create Free Account
            </Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
