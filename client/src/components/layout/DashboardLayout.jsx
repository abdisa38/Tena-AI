import { Outlet, Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  User, 
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Assessment', href: '/dashboard/assessment/new', icon: PlusCircle },
    { name: 'History', href: '/dashboard/assessments', icon: FileText },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-cloud-gray">
      {/* Mobile Header */}
      <div className="lg:hidden bg-tena-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-tena-yellow rounded-lg flex items-center justify-center">
            <span className="text-tena-black font-bold">T</span>
          </div>
          <span className="font-bold text-tena-black">TenaAI</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-40 w-64 bg-tena-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 lg:static',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-2 p-6 border-b border-gray-200">
              <div className="w-10 h-10 bg-tena-yellow rounded-lg flex items-center justify-center">
                <span className="text-tena-black font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold text-tena-black">TenaAI</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'bg-tena-yellow text-tena-black font-medium'
                      : 'text-gray-600 hover:bg-cloud-gray'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-tena-black truncate">
                    Your Account
                  </p>
                  <p className="text-xs text-gray-500">
                    Manage settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
