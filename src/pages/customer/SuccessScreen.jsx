import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, CalendarDays } from 'lucide-react';
import { formatNaira } from '../../lib/format';

const serviceNames = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  generator_repair: 'Generator Repair',
  carpentry: 'Carpentry',
};

const timeOptionLabels = {
  '15': 'within 15 mins',
  '30': 'within 30 mins',
  '60': 'within 1 hour',
  '120': 'within 2 hours',
  '240': 'within 4 hours',
  flexible: 'at a flexible time',
};

const formatBookedDate = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function SuccessScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceKey = searchParams.get('service') || 'plumbing';
  const service = serviceNames[serviceKey] || serviceKey;
  const price = searchParams.get('price') || '20000';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';

  const bookedDate = formatBookedDate(date);
  const timeLabel = timeOptionLabels[time] || 'at your scheduled time';
  const estimated = time === 'flexible'
    ? 'Your KWIKFIXER will contact you shortly to agree on a convenient time.'
    : `Your KWIKFIXER is expected to be available ${timeLabel} of your scheduled time on ${bookedDate}.`;

  const trackingId = `KFX-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

  return (
    <div className="min-h-screen bg-navy p-4 flex flex-col">
      <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full self-start">
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-[#10B981]/15 flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-[#10B981]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Booking Confirmed!</h2>
        <p className="text-muted mb-8">Your KWIKFIXER is on the way</p>
        <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-lg p-6 w-full max-w-sm mb-4">
          <div className="border-b border-white/10 pb-3 mb-3">
            <p className="text-sm text-muted">Service</p>
            <p className="font-bold text-white">{service}</p>
          </div>
          <div className="border-b border-white/10 pb-3 mb-3">
            <p className="text-sm text-muted flex items-center gap-1"><CalendarDays size={13} /> Scheduled Date</p>
            <p className="font-bold text-white">{bookedDate}</p>
          </div>
          <div className="border-b border-white/10 pb-3 mb-3">
            <p className="text-sm text-muted flex items-center gap-1"><Clock size={13} /> Time Request</p>
            <p className="font-bold text-white capitalize">{timeLabel}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Agreed Price</p>
            <p className="font-bold text-accent">{formatNaira(price)}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-faint">Tracking: {trackingId}</p>
          </div>
        </div>
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 w-full max-w-sm mb-8">
          <p className="text-sm font-semibold text-accent flex items-center gap-1 mb-1">
            <Clock className="w-4 h-4" /> Estimated Handyman Availability
          </p>
          <p className="text-sm text-slate-200">{estimated}</p>
        </div>
        <button
          onClick={() => navigate('/customer/dashboard')}
          className="w-full max-w-sm bg-white text-navy py-3 rounded-2xl font-bold hover:bg-slate-100"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
