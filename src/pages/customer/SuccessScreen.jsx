import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { formatNaira, formatDate } from '../../lib/format';

export default function SuccessScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service = searchParams.get('service') || 'Plumbing';
  const price = searchParams.get('price') || '20000';

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
        <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-lg p-6 w-full max-w-sm mb-8">
          <div className="border-b border-white/10 pb-3 mb-3">
            <p className="text-sm text-muted">Service</p>
            <p className="font-bold text-white">{service}</p>
          </div>
          <div className="border-b border-white/10 pb-3 mb-3">
            <p className="text-sm text-muted">Date</p>
            <p className="font-bold text-white">{formatDate(new Date())}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Agreed Price</p>
            <p className="font-bold text-accent">{formatNaira(price)}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-faint">Tracking: {trackingId}</p>
          </div>
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
