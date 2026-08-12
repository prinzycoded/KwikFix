import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import SidebarLayout from './components/SidebarLayout';

import LandingPage from './pages/LandingPage';
import ServiceSelection from './pages/customer/ServiceSelection';
import BookingForm from './pages/customer/BookingForm';
import CustomerAuth from './pages/customer/CustomerAuth';
import MatchingAnimation from './pages/customer/MatchingAnimation';
import HandymanProfile from './pages/customer/HandymanProfile';
import SuccessScreen from './pages/customer/SuccessScreen';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerSettings from './pages/customer/CustomerSettings';
import ActiveJobScreen from './pages/customer/ActiveJobScreen';
import ChatPopup from './pages/customer/ChatPopup';

import HandymanSetup from './pages/handyman/HandymanSetup';
import HandymanDashboard from './pages/handyman/HandymanDashboard';
import WithdrawFunds from './pages/handyman/WithdrawFunds';
import PortfolioUpload from './pages/handyman/PortfolioUpload';
import HandymanSettings from './pages/handyman/HandymanSettings';

import DIYScreen from './pages/customer/DIYScreen';

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
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
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

              <Route path="/handyman/login" element={<RedirectIfAuthed><HandymanSetup /></RedirectIfAuthed>} />
              <Route path="/handyman/dashboard" element={<RequireAuth role="handyman"><DashboardLayout><HandymanDashboard /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/withdraw" element={<RequireAuth role="handyman"><DashboardLayout><WithdrawFunds /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/portfolio" element={<RequireAuth role="handyman"><DashboardLayout><PortfolioUpload /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/settings" element={<RequireAuth role="handyman"><DashboardLayout><HandymanSettings /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/active-job/:id" element={<RequireAuth role="handyman"><DashboardLayout><ActiveJobScreen /></DashboardLayout></RequireAuth>} />
              <Route path="/handyman/chat/:id" element={<RequireAuth role="handyman"><DashboardLayout><ChatPopup /></DashboardLayout></RequireAuth>} />

              <Route path="/diy-sos" element={<DIYScreen />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
