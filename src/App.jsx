import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/service-selection" element={<ServiceSelection />} />
              <Route path="/booking-form" element={<BookingForm />} />
              <Route path="/auth" element={<CustomerAuth />} />
              <Route path="/matching" element={<MatchingAnimation />} />
              <Route path="/customer/handyman-profile" element={<HandymanProfile />} />
              <Route path="/customer/success" element={<SuccessScreen />} />

              <Route path="/customer/dashboard" element={<DashboardLayout><CustomerDashboard /></DashboardLayout>} />
              <Route path="/customer/settings" element={<DashboardLayout><CustomerSettings /></DashboardLayout>} />
              <Route path="/customer/active-job/:id" element={<DashboardLayout><ActiveJobScreen /></DashboardLayout>} />
              <Route path="/customer/chat/:id" element={<DashboardLayout><ChatPopup /></DashboardLayout>} />

              <Route path="/handyman/login" element={<HandymanSetup />} />
              <Route path="/handyman/dashboard" element={<DashboardLayout><HandymanDashboard /></DashboardLayout>} />
              <Route path="/handyman/withdraw" element={<DashboardLayout><WithdrawFunds /></DashboardLayout>} />
              <Route path="/handyman/portfolio" element={<DashboardLayout><PortfolioUpload /></DashboardLayout>} />
              <Route path="/handyman/settings" element={<DashboardLayout><HandymanSettings /></DashboardLayout>} />
              <Route path="/handyman/active-job/:id" element={<DashboardLayout><ActiveJobScreen /></DashboardLayout>} />

              <Route path="/diy-sos" element={<DIYScreen />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
