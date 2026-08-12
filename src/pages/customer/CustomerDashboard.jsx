import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, Star, Wrench, Settings, MapPin, Calendar, Clock, PackageOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { formatDate } from '../../lib/format';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';

const timeOptionLabels = {
  '15': 'within 15 mins',
  '30': 'within 30 mins',
  '60': 'within 1 hour',
  '120': 'within 2 hours',
  '240': 'within 4 hours',
  flexible: 'flexible time',
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { bookings } = useApp();

  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] || 'there';

  const openBooking = (id) => navigate(`/customer/active-job/${id}`);

  return (
    <div className="min-h-screen max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Avatar name={currentUser?.fullName || 'Customer'} size={48} />
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}!</h1>
          <p className="text-muted flex items-center gap-1"><MapPin size={12} /> Umuahia, Abia State</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Briefcase} value={String(bookings.length)} label="Active Bookings" />
        <StatCard icon={Home} value="12" label="Completed" iconBg="bg-emerald-500/15" iconColor="text-emerald-400" valueClass="text-white" />
        <StatCard icon={Star} value="4.9" label="Average Rating" iconBg="bg-amber-500/15" iconColor="text-amber-400" valueClass="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-white mb-3">Active Bookings</h2>
          {bookings.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title="No bookings yet"
              message="When you book a service, your active bookings will show up here."
              action={() => navigate('/service-selection')}
              actionLabel="Book a Service"
            />
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => openBooking(b.id)}
                  className="w-full text-left bg-navy-800 border border-white/10 rounded-2xl p-4 hover:border-white/25 hover:bg-navy-700 transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{b.service}</span>
                    <Badge tone="success">In Progress</Badge>
                  </div>
                  <p className="text-sm text-muted flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" /> {b.address || 'Umuahia, Abia State'}</p>
                  <p className="text-xs text-faint mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(b.date || new Date())}
                    {b.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeOptionLabels[b.time] || b.time}</span>}
                    <span className="ml-auto flex items-center gap-1 text-accent">View details <ChevronRight className="w-3.5 h-3.5" /></span>
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-bold text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/service-selection')} className="bg-accent text-white rounded-2xl p-6 flex flex-col items-center gap-2 hover:bg-accent-dark transition-colors active:scale-[0.98]">
              <Wrench className="w-8 h-8" /><span className="font-medium">New Service</span>
            </button>
            <button onClick={() => navigate('/customer/settings')} className="bg-navy-800 text-white rounded-2xl p-6 flex flex-col items-center gap-2 border border-white/10 hover:bg-navy-700 transition-colors active:scale-[0.98]">
              <Settings className="w-8 h-8 text-muted" /><span className="font-medium">Settings</span>
            </button>
          </div>

          {bookings.length > 0 && (
            <div className="mt-3 bg-navy-800 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-accent" />
                <p className="font-medium text-white text-sm">Handyman arriving soon?</p>
              </div>
              <p className="text-xs text-muted">Track your active job and see live updates from your KWIKFIXER.</p>
              <button onClick={() => openBooking(bookings[0].id)} className="mt-3 w-full py-2.5 bg-white text-navy rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
                View Active Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
