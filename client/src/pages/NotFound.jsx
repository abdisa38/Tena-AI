import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '@components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cloud-gray">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-tena-black">404</h1>
        <p className="text-2xl text-gray-600 mt-4 mb-8">Page not found</p>
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
