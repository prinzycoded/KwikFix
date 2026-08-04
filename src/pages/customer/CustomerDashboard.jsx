import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, Star, Wrench, Settings, MapPin, Calendar, Clock, PackageOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, daysAgo } from '../../lib/format';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';

const mockBookings = [
  { id: '1', service: 'Plumbing', address: '12, Azikiwe Road, Umuahia', date: daysAgo(1), status: 'active' },
  { id: '2', service: 'Electrical', address: '7, Faulks Road, Aba', date: daysAgo(3), status: 'scheduled' },
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] || 'there';

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
        <StatCard icon={Briefcase} value="2" label="Active Bookings" />
        <StatCard icon={Home} value="12" label="Completed" iconBg="bg-emerald-500/15" iconColor="text-emerald-400" valueClass="text-white" />
        <StatCard icon={Star} value="4.9" label="Average Rating" iconBg="bg-amber-500/15" iconColor="text-amber-400" valueClass="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-white mb-3">Active Bookings</h2>
          {mockBookings.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title="No bookings yet"
              message="When you book a service, your active bookings will show up here."
              action={() => navigate('/service-selection')}
              actionLabel="Book a Service"
            />
          ) : (
            <div className="space-y-3">
              {mockBookings.map((b) => (
                <div key={b.id} className="bg-navy-800 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{b.service}</span>
                    <Badge tone={b.status === 'active' ? 'success' : 'info'}>{b.status === 'active' ? 'In Progress' : 'Scheduled'}</Badge>
                  </div>
                  <p className="text-sm text-muted flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" /> {b.address}</p>
                  <p className="text-xs text-faint mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(b.date)}</p>
                </div>
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

          <div className="mt-3 bg-navy-800 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-accent" />
              <p className="font-medium text-white text-sm">Handyman arriving soon?</p>
            </div>
            <p className="text-xs text-muted">Track your active job and see live updates from your KWIKFIXER.</p>
            <button onClick={() => navigate('/customer/active-job/1')} className="mt-3 w-full py-2.5 bg-white text-navy rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
              View Active Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
