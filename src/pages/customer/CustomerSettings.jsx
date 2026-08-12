import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Shield, LogOut, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function CustomerSettings() {
  const navigate = useNavigate();
  const { logout, isEmailVerified, sendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleVerify = async () => {
    setSending(true);
    try {
      await sendVerificationEmail();
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="bg-navy-800 border border-white/10 rounded-2xl p-4 mb-4 flex items-center gap-3">
        {isEmailVerified ? (
          <>
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-[#10B981]" /></div>
            <div className="flex-1">
              <p className="font-medium text-white text-sm">Email Verified</p>
              <p className="text-xs text-muted">Your account is verified. No action needed.</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center"><Mail className="w-5 h-5 text-accent" /></div>
            <div className="flex-1">
              <p className="font-medium text-white text-sm">Verify Your Email</p>
              <p className="text-xs text-muted">Verification links protect your account and unlock bookings.</p>
            </div>
            <button
              onClick={handleVerify}
              disabled={sending}
              className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent-dark disabled:opacity-60 flex items-center gap-1"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              {sent ? 'Sent!' : 'Send Link'}
            </button>
          </>
        )}
      </div>

      <div className="bg-navy-800 border border-white/10 rounded-2xl divide-y divide-white/10">
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
        onClick={handleLogout}
        className="mt-6 bg-navy-800 border border-white/10 rounded-2xl p-4 flex items-center gap-3 w-full hover:bg-navy-700"
      >
        <LogOut className="w-5 h-5 text-[#F87171]" />
        <span className="font-medium text-[#F87171]">Sign Out</span>
      </button>
    </div>
  );
}