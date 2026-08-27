import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from '@pages/LandingPage';
import Dashboard from '@pages/Dashboard';
import NewAssessment from '@pages/NewAssessment';
import AssessmentHistory from '@pages/AssessmentHistory';
import AssessmentDetail from '@pages/AssessmentDetail';
import Profile from '@pages/Profile';
import Subscription from '@pages/Subscription';
import SubscriptionSuccess from '@pages/SubscriptionSuccess';
import SubscriptionCancel from '@pages/SubscriptionCancel';
import NotFound from '@pages/NotFound';

// Layouts
import MainLayout from '@components/layout/MainLayout';
import DashboardLayout from '@components/layout/DashboardLayout';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* Subscription Success/Cancel (outside dashboard) */}
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <DashboardLayout />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="assessment/new" element={<NewAssessment />} />
            <Route path="assessments" element={<AssessmentHistory />} />
            <Route path="assessments/:id" element={<AssessmentDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="subscription" element={<Subscription />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111111',
            color: '#FFFFFF',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </>
  );
}

export default App;
