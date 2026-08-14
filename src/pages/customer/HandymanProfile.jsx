import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, X, Wrench, Bath, Flame, Droplets, ShieldCheck, UserCheck } from 'lucide-react';
import Avatar from '../../components/Avatar';
import { useApp } from '../../contexts/AppContext';
import { getHandymanNiches, nichesLabel } from '../../lib/niches';

const portfolioItems = [
  { title: 'Kitchen Sink Repair', icon: Wrench, color: 'text-accent' },
  { title: 'Bathroom Fittings', icon: Bath, color: 'text-sky-400' },
  { title: 'Water Heater Install', icon: Flame, color: 'text-amber-400' },
  { title: 'Burst Pipe Fix', icon: Droplets, color: 'text-emerald-400' },
];

export default function HandymanProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createBooking, registeredHandymen, presenceStatuses } = useApp();
  const service = searchParams.get('service') || 'Plumbing';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const address = searchParams.get('address') || '';
  const handymanId = searchParams.get('handymanId') || '';

  // Only ever shows a handyman who registered an account on KwikFix
  // (the directory is written at registration / first login only).
  const handyman = useMemo(
    () => registeredHandymen.find((h) => (h.uid || h.id) === handymanId) || null,
    [registeredHandymen, handymanId],
  );

  const isOnline = handyman && presenceStatuses[handyman.uid || handyman.id]?.status === 'online';

  const [proposedPrice, setProposedPrice] = useState(20000);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const confirmBooking = async () => {
    if (!agreedPrice) return;
    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      const id = await createBooking({
        service,
        date,
        time,
        address,
        price: Number(agreedPrice),
        description: '',
      });
      const params = new URLSearchParams({
        id,
        service,
        price: agreedPrice,
        date,
        time,
        address,
      });
      navigate(`/customer/success?${params.toString()}`);
    } catch (err) {
      setError(err?.message || 'Failed to create booking. Please try again.');
      setShowConfirmModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {!handyman ? (
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-10 text-center">
            <UserCheck className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Handyman not found</h2>
            <p className="text-sm text-muted mb-6">
              This handyman is not in the registered directory. Only handymen who created an account on KwikFix can be booked.
            </p>
            <button onClick={() => navigate('/service-selection')} className="bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-accent-dark">
              Back to Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar name={handyman.fullName || 'KWIKFIXER'} size={80} />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{handyman.fullName || 'KWIKFIXER'}</h2>
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(handyman.rating || 0) ? 'fill-current' : 'opacity-25'}`} />)}
                      <span className="text-muted ml-1">{handyman.rating ? handyman.rating : 'New'}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {handyman.isVerified ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-[#10B981]" /><span className="text-xs text-[#10B981]">NIN Verified</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#10B981]" /><span className="text-xs text-[#10B981]">Registered</span>
                        </>
                      )}
                      <span className={`w-2 h-2 rounded-full ml-2 ${isOnline ? 'bg-[#10B981]' : 'bg-muted'}`} />
                      <span className={`text-xs ${isOnline ? 'text-[#10B981]' : 'text-muted'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <p className="text-muted text-sm mt-1 capitalize">{nichesLabel(getHandymanNiches(handyman)) || 'General'} · {handyman.yearsOfExperience || 0} years experience</p>
                  </div>
                </div>
              </div>

              <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="font-bold text-white mb-3">Work Portfolio</h3>
                <div className="grid grid-cols-2 gap-2">
                  {portfolioItems.map((item, i) => (
                    <div key={i} className="aspect-square rounded-xl border border-white/10 overflow-hidden group">
                      <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center gap-2 group-hover:bg-white/10 transition-all">
                        <item.icon size={32} className={item.color} />
                        <p className="text-[10px] text-muted text-center px-2">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="font-bold text-white mb-3">Price Estimate</h3>
                <div className="bg-navy-700 rounded-xl p-4 mb-4">
                  <p className="text-muted text-sm mb-2">Market Research: ₦15,000 - ₦25,000</p>
                  <div className="space-y-1 text-sm text-muted">
                    <p>• Senior qualification level: +₦5,000</p>
                    <p>• Customer provides tools: -₦2,000</p>
                    <p className="font-bold text-white pt-1">Estimated: ₦18,000 - ₦23,000</p>
                  </div>
                </div>
                <label className="text-sm font-semibold text-white mb-2 block">Proposed Price: ₦{proposedPrice.toLocaleString()}</label>
                <input type="range" min={5000} max={50000} step={500} value={proposedPrice} onChange={(e) => setProposedPrice(Number(e.target.value))} className="w-full accent-[#FF6B1A]" />
                <div className="flex justify-between text-xs mt-1"><span className="text-muted">₦5,000</span><span className="text-muted">₦50,000</span></div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-white/10 bg-navy-800/60">
                  <p className="text-xs text-muted flex items-center gap-1">
                    <UserCheck size={14} className="text-[#10B981]" />
                    Registered handyman on KwikFix — chat opens once your job is accepted.
                  </p>
                </div>
                <button onClick={() => setShowConfirmModal(true)} className="w-full bg-white text-navy py-3 rounded-2xl font-bold hover:bg-slate-100">
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showConfirmModal && handyman && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmModal(false)}>
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowConfirmModal(false)} className="float-right"><X className="w-5 h-5 text-muted" /></button>
            <h3 className="text-lg font-bold text-white mb-3 mt-2">Enter Agreed Price</h3>
            <input type="number" value={agreedPrice ?? ''} onChange={(e) => setAgreedPrice(e.target.value)} placeholder="e.g. 20000" className="w-full border border-white/15 bg-navy-700 text-white placeholder:text-muted/60 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-accent" />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button onClick={() => { if (agreedPrice) { confirmBooking(); } }} disabled={submitting} className="w-full bg-white text-navy py-3 rounded-2xl font-bold hover:bg-slate-100 disabled:opacity-60">{submitting ? 'Creating booking...' : 'Submit Agreement'}</button>
          </div>
        </div>
      )}
    </div>
  );
}