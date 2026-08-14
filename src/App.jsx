import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import SidebarLayout from './components/SidebarLayout';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const ServiceSelection = lazy(() => import('./pages/customer/ServiceSelection'));
const BookingForm = lazy(() => import('./pages/customer/BookingForm'));
const CustomerAuth = lazy(() => import('./pages/customer/CustomerAuth'));
const MatchingAnimation = lazy(() => import('./pages/customer/MatchingAnimation'));
const HandymanProfile = lazy(() => import('./pages/customer/HandymanProfile'));
const SuccessScreen = lazy(() => import('./pages/customer/SuccessScreen'));
const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard'));
const CustomerSettings = lazy(() => import('./pages/customer/CustomerSettings'));
const ActiveJobScreen = lazy(() => import('./pages/customer/ActiveJobScreen'));
const ChatPopup = lazy(() => import('./pages/customer/ChatPopup'));

const HandymanSetup = lazy(() => import('./pages/handyman/HandymanSetup'));
const HandymanDashboard = lazy(() => import('./pages/handyman/HandymanDashboard'));
const WithdrawFunds = lazy(() => import('./pages/handyman/WithdrawFunds'));
const PortfolioUpload = lazy(() => import('./pages/handyman/PortfolioUpload'));
const HandymanSettings = lazy(() => import('./pages/handyman/HandymanSettings'));
const PrivacySecurity = lazy(() => import('./pages/handyman/PrivacySecurity'));

const DIYScreen = lazy(() => import('./pages/customer/DIYScreen'));

function DashboardLayout({ children }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-white/15 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

function RequireAuth({ role, children }) {
  const { isAuthenticated, userRole, initializing } = useAuth();
  if (initializing) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;
  return children;
}

function RedirectIfAuthed({ children }) {
  const { isAuthenticated, userRole, initializing } = useAuth();
  if (initializing) return <LoadingScreen />;
  if (isAuthenticated) {
    return <Navigate to={userRole === 'handyman' ? '/handyman/dashboard' : '/customer/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/service-selection" element={<RequireAuth role="customer"><ServiceSelection /></RequireAuth>} />
              <Route path="/booking-form" element={<RequireAuth role="customer"><BookingForm /></RequireAuth>} />
              <Route path="/auth" element={<RedirectIfAuthed><CustomerAuth /></RedirectIfAuthed>} />
              <Route path="/matching" element={<RequireAuth role="customer"><MatchingAnimation /></RequireAuth>} />
              <Route path="/customer/handyman-profile" element={<RequireAuth role="customer"><HandymanProfile /></RequireAuth>} />
              <Route path="/customer/success" element={<RequireAuth role="customer"><SuccessScreen /></RequireAuth>} />

              <Route path="/customer/dashboard" element={<RequireAuth role="customer"><DashboardLayout><CustomerDashboard /></DashboardLayout></RequireAuth>} />
              <Route path="/customer/settings" element={<RequireAuth role="customer"><DashboardLayout><CustomerSettings /></DashboardLayout></RequireAuth>} />
              <Route path="/customer/active-job/:id" element={<RequireAuth role="customer"><DashboardLayout><ActiveJobScreen /></DashboardLayout></RequireAuth>} />
              <Route path="/customer/chat/:id" element={<RequireAuth role="customer"><DashboardLayout><ChatPopup /></DashboardLayout></RequireAuth>} />

              <Route path="/handyman/login" element={<HandymanSetup />} />
              <Route path="/handyman/dashboard" element={<RequireAuth role="handyman"><DashboardLayout><HandymanDashboard /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/withdraw" element={<RequireAuth role="handyman"><DashboardLayout><WithdrawFunds /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/portfolio" element={<RequireAuth role="handyman"><DashboardLayout><PortfolioUpload /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/settings" element={<RequireAuth role="handyman"><DashboardLayout><HandymanSettings /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/privacy" element={<RequireAuth role="handyman"><DashboardLayout><PrivacySecurity /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/active-job/:id" element={<RequireAuth role="handyman"><DashboardLayout><ActiveJobScreen /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/chat/:id" element={<RequireAuth role="handyman"><DashboardLayout><ChatPopup /></DashboardLayout></RequireAuth>} />

              <Route path="/diy-sos" element={<DIYScreen />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}