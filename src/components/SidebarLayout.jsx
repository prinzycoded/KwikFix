import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Briefcase, User, Settings, Wrench, Calendar, Wallet, Image, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import heroImg from '../assets/Kwik.img.png';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userRole, logout } = useAuth();

  const links = userRole === 'handyman' ? handymanLinks : customerLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goTo = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className={`min-h-screen flex bg-navy`}>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`${
          collapsed ? 'md:w-16' : 'w-60'
        } bg-navy-800 border-r border-white/10 flex flex-col transition-all duration-300 fixed h-full z-50 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative flex items-center justify-between p-4 border-b border-white/10 overflow-hidden">
          {!collapsed && (
            <>
              <div className="absolute inset-0">
                <img src={heroImg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy/80" />
              </div>
              <div className="relative z-10 flex items-center gap-2">
                <Wrench size={22} className="text-accent" />
                <span className="text-xl font-bold text-white">
                  Kwik<span className="text-accent">Fix</span>
                </span>
              </div>
            </>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="relative z-10 md:hidden p-1.5 rounded-lg hover:bg-white/10"
          >
            <X size={20} className="text-white" />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`relative z-10 hidden md:block p-1.5 rounded-lg hover:bg-white/10 ${collapsed ? 'ml-auto' : ''}`}
          >
            {collapsed ? <Menu size={20} className="text-muted" /> : <X size={20} className="text-muted" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.label}
                onClick={() => goTo(link.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-muted hover:bg-white/10 hover:text-white'
                }`}
                title={collapsed ? link.label : undefined}
              >
                <link.icon size={20} />
                {!collapsed && <span>{link.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3 space-y-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              collapsed ? 'justify-center' : ''
            } text-red-400 hover:bg-red-500/10`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ml-0 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <div className="md:hidden sticky top-0 z-30 relative overflow-hidden px-4 h-14 flex items-center justify-between border-b border-white/10 pt-[env(safe-area-inset-top)]">
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/80" />
          <button
            onClick={() => setMobileOpen(true)}
            className="relative z-10 p-2 -ml-2 rounded-lg hover:bg-white/10"
          >
            <Menu size={22} className="text-white" />
          </button>
          <div className="relative z-10 flex items-center gap-1.5">
            <Wrench size={18} className="text-accent" />
            <span className="text-lg font-bold text-white">
              Kwik<span className="text-accent">Fix</span>
            </span>
          </div>
          <span className="w-9 relative z-10" />
        </div>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
