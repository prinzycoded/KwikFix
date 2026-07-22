import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, User, Settings, Wrench, Calendar, Star, Clock, MapPin, Bell } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const mockBookings = [
  { id: '1', service: 'Plumbing', address: '123 Main Street, Ikeja', date: '2024-12-15', status: 'active' },
  { id: '2', service: 'Electrical', address: '45 Park Avenue', date: '2024-12-20', status: 'scheduled' },
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [tab, setTab] = useState('home');

  return (
    <div className={`min-h-screen max-w-5xl ${darkMode ? 'dark bg-gray-900' : 'bg-[#F4F4F4]'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003366] dark:text-white">Welcome back!</h1>
        <p className="text-gray-500 dark:text-gray-400">John Doe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
          <p className="text-3xl font-bold text-[#003366] dark:text-white">2</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Bookings</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
          <p className="text-3xl font-bold text-[#FF6600]">12</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
          <p className="text-3xl font-bold text-green-600">4.9</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-[#003366] dark:text-white mb-3">Active Bookings</h2>
          <div className="space-y-3">
            {mockBookings.map((b) => (
              <div key={b.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#003366] dark:text-white">{b.service}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.address}</p>
                <p className="text-xs text-gray-400 mt-1">{b.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-[#003366] dark:text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/service-selection')} className="bg-[#003366] text-white rounded-2xl p-6 flex flex-col items-center gap-2 hover:bg-[#004488]">
              <Wrench className="w-8 h-8" /><span className="font-medium">New Service</span>
            </button>
            <button onClick={() => navigate('/customer/settings')} className="bg-white dark:bg-gray-800 text-[#003366] dark:text-white rounded-2xl p-6 shadow flex flex-col items-center gap-2 border dark:border-gray-700">
              <Settings className="w-8 h-8" /><span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
