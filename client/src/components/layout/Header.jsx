import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from '@components/ui/Button';

const Header = () => {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-tena-white border-b border-cloud-gray">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-tena-yellow rounded-lg flex items-center justify-center">
              <span className="text-tena-black font-bold text-xl">T</span>
            </div>
            <span className="text-xl font-bold text-tena-black">TenaAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isSignedIn ? (
              <>
                <Link to="/dashboard" className="text-tena-black hover:text-gray-600">
                  Dashboard
                </Link>
                <Link to="/dashboard/assessment/new" className="text-tena-black hover:text-gray-600">
                  New Assessment
                </Link>
                <Link to="/dashboard/assessments" className="text-tena-black hover:text-gray-600">
                  History
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cloud-gray animate-slide-down">
            {isSignedIn ? (
              <div className="flex flex-col gap-4">
                <Link 
                  to="/dashboard" 
                  className="text-tena-black hover:text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard/assessment/new" 
                  className="text-tena-black hover:text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Assessment
                </Link>
                <Link 
                  to="/dashboard/assessments" 
                  className="text-tena-black hover:text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  History
                </Link>
                <div className="pt-4 border-t border-cloud-gray">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
