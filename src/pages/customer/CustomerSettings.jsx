import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Bell, Shield, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="bg-navy-800 border border-white/10 rounded-2xl divide-y divide-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">{darkMode ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}</div>
            <span className="font-medium text-white">Dark Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-accent' : 'bg-white/20'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Bell className="w-5 h-5 text-muted" /></div>
          <span className="font-medium text-white">Push Notifications</span>
          <span className="ml-auto text-sm text-muted">Enabled</span>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Shield className="w-5 h-5 text-muted" /></div>
          <span className="font-medium text-white">Privacy</span>
          <span className="ml-auto text-sm text-muted">Standard</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-navy-800 border border-white/10 rounded-2xl p-4 flex items-center gap-3 w-full hover:bg-navy-700"
      >
        <LogOut className="w-5 h-5 text-[#F87171]" />
        <span className="font-medium text-[#F87171]">Sign Out</span>
      </button>
    </div>
  );
}
