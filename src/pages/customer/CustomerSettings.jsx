import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Bell, Shield, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[#003366] dark:text-white mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow divide-y dark:divide-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-[#003366] dark:text-white" /> : <Sun className="w-5 h-5 text-[#003366]" />}
            <span className="font-medium text-[#003366] dark:text-white">Dark Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-[#003366]' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="flex items-center gap-3 p-4">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-[#003366] dark:text-white">Push Notifications</span>
          <span className="ml-auto text-sm text-gray-400">Enabled</span>
        </div>
        <div className="flex items-center gap-3 p-4">
          <Shield className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-[#003366] dark:text-white">Privacy</span>
          <span className="ml-auto text-sm text-gray-400">Standard</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow p-4 flex items-center gap-3 border dark:border-gray-700"
      >
        <LogOut className="w-5 h-5 text-red-500" />
        <span className="font-medium text-red-500">Sign Out</span>
      </button>
    </div>
  );
}
