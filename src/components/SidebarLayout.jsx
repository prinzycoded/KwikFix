import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Briefcase, User, Settings, Wrench, Calendar, Wallet, Image, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const customerLinks = [
  { label: 'Dashboard', icon: Home, path: '/customer/dashboard' },
  { label: 'Book a Service', icon: Wrench, path: '/service-selection' },
  { label: 'My Bookings', icon: Calendar, path: '/customer/dashboard' },
  { label: 'Settings', icon: Settings, path: '/customer/settings' },
];

const handymanLinks = [
  { label: 'Dashboard', icon: Home, path: '/handyman/dashboard' },
  { label: 'Portfolio', icon: Image, path: '/handyman/portfolio' },
  { label: 'Withdraw', icon: Wallet, path: '/handyman/withdraw' },
  { label: 'Settings', icon: Settings, path: '/handyman/settings' },
];

export default function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userRole, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const links = userRole === 'handyman' ? handymanLinks : customerLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-[#F4F4F4]'}`}>
      <aside
        className={`${
          collapsed ? 'w-16' : 'w-60'
        } bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col transition-all duration-300 fixed h-full z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          {!collapsed && (
            <h1 className="text-xl font-bold text-[#003366] dark:text-white">Kwikfix</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? <Menu size={20} className="text-gray-500" /> : <X size={20} className="text-gray-500" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#003366] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={collapsed ? link.label : undefined}
              >
                <link.icon size={20} />
                {!collapsed && <span>{link.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t dark:border-gray-700 p-3 space-y-2">
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              collapsed ? 'justify-center' : ''
            } text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
            title={collapsed ? 'Toggle Theme' : undefined}
          >
            <span className="text-base">{darkMode ? '☀️' : '🌙'}</span>
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              collapsed ? 'justify-center' : ''
            } text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
