import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, Bell, Globe, Lock, ChevronRight, Smartphone, Info, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

function SettingsToggle({ icon, label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      <div onClick={() => onChange(!value)} className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${value ? 'bg-accent' : 'bg-white/20'}`}>
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </div>
    </div>
  );
}

function SettingsLink({ icon, label, description, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-faint" />
    </button>
  );
}

function HandymanSettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-navy-800 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 pt-4 pb-2"><h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Appearance</h2></div>
          <div className="border-t border-white/10">
            <SettingsToggle icon={darkMode ? <Moon size={18} className="text-accent" /> : <Sun size={18} className="text-accent" />} label="Dark Mode" description={darkMode ? 'Dark theme is active' : 'Switch to dark theme'} value={darkMode} onChange={toggleDarkMode} />
          </div>
        </div>

        <div className="bg-navy-800 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 pt-4 pb-2"><h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Preferences</h2></div>
          <div className="border-t border-white/10">
            <SettingsToggle icon={<Bell size={18} className="text-accent" />} label="Push Notifications" description="Receive job alerts and updates" value={notificationsEnabled} onChange={setNotificationsEnabled} />
            <div className="border-t border-white/10">
              <SettingsToggle icon={<Globe size={18} className="text-accent" />} label="Location Services" description="Show jobs near your area" value={locationEnabled} onChange={setLocationEnabled} />
            </div>
          </div>
        </div>

        <div className="bg-navy-800 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 pt-4 pb-2"><h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Account</h2></div>
          <div className="border-t border-white/10">
            <SettingsLink icon={<Lock size={18} className="text-accent" />} label="Privacy & Security" description="Manage your account security" onClick={() => {}} />
            <div className="border-t border-white/10">
              <SettingsLink icon={<Smartphone size={18} className="text-accent" />} label="App Version" description="v1.0.0 (Build 1)" onClick={() => {}} />
            </div>
            <div className="border-t border-white/10">
              <SettingsLink icon={<Info size={18} className="text-accent" />} label="About KWIKFIX" description="Learn more about the platform" onClick={() => {}} />
            </div>
          </div>
        </div>

        <button onClick={() => setShowLogoutConfirm(true)} className="w-full py-3.5 bg-red-500/10 text-[#F87171] rounded-xl font-semibold text-sm hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4"><LogOut size={28} className="text-[#F87171]" /></div>
            <h3 className="text-lg font-bold text-white mb-2">Sign Out?</h3>
            <p className="text-sm text-muted mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 border border-white/15 rounded-xl text-sm font-semibold text-muted hover:bg-white/5">Cancel</button>
              <button onClick={() => { logout(); navigate('/'); }} className="flex-1 py-2.5 bg-[#EF4444] text-white rounded-xl text-sm font-semibold hover:bg-red-600">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandymanSettings;
