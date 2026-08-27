import { Link } from 'react-router-dom';
import { SignUpButton, useUser } from '@clerk/clerk-react';
import { 
  Activity, 
  BarChart3, 
  Shield, 
  Globe, 
  Check,
  ArrowRight,
  Mic,
  Brain,
  Clock,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';

const LandingPage = () => {
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: Mic,
      title: 'Voice Recording',
      description: 'Record symptoms in your preferred language.'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Get instant health insights with high confidence.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected.'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'English, Amharic, and Afaan Oromoo supported.'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Fast Results',
      description: 'Get health insights in minutes, not hours.'
    },
    {
      icon: BarChart3,
      title: 'Accurate Analysis',
      description: 'AI-powered assessment with medical knowledge.'
    },
    {
      icon: Users,
      title: 'Professional Care',
      description: 'Connect with healthcare providers when needed.'
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: '0',
      features: [
        '5 assessments per month',
        'Basic AI analysis',
        'Email support',
        'Assessment history'
      ]
    },
    {
      name: 'Basic',
      price: '9.99',
      popular: true,
      features: [
        'Unlimited assessments',
        'Priority AI processing',
        'Email support',
        'PDF reports',
        'Advanced analytics'
      ]
    },
    {
      name: 'Premium',
      price: '19.99',
      features: [
        'All Basic features',
        'Doctor consultations',
        'Priority support',
        'Family sharing (4 members)',
        'Early access to features'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-tena-yellow via-yellow-300 to-white py-20 md:py-32 overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-tena-black mb-6">
              Act Faster.<br />Care Better.
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-2xl mx-auto">
              AI-powered health assessment in your language.
            </p>
            <p className="text-lg text-gray-700 mb-10 max-w-xl mx-auto">
              Get instant medical insights and professional care for Ethiopian people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <Button variant="primary" size="lg">
                    Get Started Free
                  </Button>
                </SignUpButton>
              )}
              <a href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-tena-black text-tena-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-tena-yellow mb-2">94%</p>
              <p className="text-gray-300">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-tena-yellow mb-2">10K+</p>
              <p className="text-gray-300">Users</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-tena-yellow mb-2">3</p>
              <p className="text-gray-300">Languages</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-tena-yellow mb-2">24/7</p>
              <p className="text-gray-300">Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tena-black mb-4">
              Professional Healthcare Analysis
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology for accurate health assessments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover>
                  <feature.icon className="w-12 h-12 text-tena-yellow mb-4" />
                  <h3 className="text-xl font-semibold text-tena-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-cloud-gray">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tena-black mb-4">
              Why Choose TenaAI?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fast, accurate, and professional healthcare support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-tena-yellow rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-tena-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-tena-black mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tena-black mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={plan.popular ? 'border-2 border-tena-yellow relative' : ''}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tena-yellow text-tena-black px-4 py-1 rounded-full text-sm font-medium">
                    Popular
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
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Content>
                <Card.Footer>
                  <SignUpButton mode="modal">
                    <Button 
                      variant={plan.popular ? 'primary' : 'outline'} 
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-tena-black text-tena-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands who trust TenaAI for health assessments.
          </p>
          <SignUpButton mode="modal">
            <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
              Create Free Account
            </Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
