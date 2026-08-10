import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, MessageSquare, X, Wrench, Bath, Flame, Droplets } from 'lucide-react';
import Avatar from '../../components/Avatar';
import { useApp } from '../../contexts/AppContext';

const portfolioItems = [
  { title: 'Kitchen Sink Repair', icon: Wrench, color: 'text-accent' },
  { title: 'Bathroom Fittings', icon: Bath, color: 'text-sky-400' },
  { title: 'Water Heater Install', icon: Flame, color: 'text-amber-400' },
  { title: 'Burst Pipe Fix', icon: Droplets, color: 'text-emerald-400' },
];

export default function HandymanProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addBooking } = useApp();
  const service = searchParams.get('service') || 'Plumbing';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const [proposedPrice, setProposedPrice] = useState(20000);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState('');

  const confirmBooking = () => {
    if (!agreedPrice) return;
    setShowConfirmModal(false);
    addBooking({
      id: `b${Date.now()}`,
      service,
      date,
      time,
      price: Number(agreedPrice),
      status: 'confirmed',
    });
    const params = new URLSearchParams({
      service: encodeURIComponent(service),
      price: agreedPrice,
      date: encodeURIComponent(date),
      time: encodeURIComponent(time),
    });
    navigate(`/customer/success?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar name="Adebayo Olamide" size={80} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Adebayo Olamide</h2>
                  <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    <span className="text-muted ml-1">4.8</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" /><span className="text-xs text-[#10B981]">Verified</span>
                    <span className="w-2 h-2 bg-[#10B981] rounded-full ml-2" /><span className="text-xs text-[#10B981]">Available</span>
                  </div>
                  <p className="text-muted text-sm mt-1">Plumbing · 8 years experience</p>
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
              <button onClick={() => navigate('/customer/chat/handyman-1')} className="w-full bg-accent text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-dark">
                <MessageSquare className="w-5 h-5" /> Chat with Handyman
              </button>
              <button onClick={() => setShowConfirmModal(true)} className="w-full bg-white text-navy py-3 rounded-2xl font-bold hover:bg-slate-100">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmModal(false)}>
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowConfirmModal(false)} className="float-right"><X className="w-5 h-5 text-muted" /></button>
            <h3 className="text-lg font-bold text-white mb-3 mt-2">Enter Agreed Price</h3>
            <input type="number" value={agreedPrice} onChange={(e) => setAgreedPrice(e.target.value)} placeholder="e.g. 20000" className="w-full border border-white/15 bg-navy-700 text-white placeholder:text-muted/60 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-accent" />
            <button onClick={() => { if (agreedPrice) { confirmBooking(); } }} className="w-full bg-white text-navy py-3 rounded-2xl font-bold hover:bg-slate-100">Submit Agreement</button>
          </div>
        </div>
      )}
    </div>
  );
}
