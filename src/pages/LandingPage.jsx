import { useNavigate } from 'react-router-dom';
import { Wrench, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003366] to-[#001a33] flex flex-col items-center justify-center px-6 relative">
      <div className="w-full max-w-md flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold text-white text-center">Kwikfix</h1>
        <p className="text-white/80 text-base">Your trusted handyman marketplace</p>
        <div className="w-15 h-0.5 bg-white/20 rounded mt-1 mb-3" />
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => navigate('/service-selection')}
            className="w-full bg-white rounded-2xl px-7 py-6 flex items-center gap-4 cursor-pointer shadow-lg font-semibold text-lg text-[#003366] hover:bg-gray-50 transition-all"
          >
            <Wrench size={26} />
            <span className="flex-1 text-left">I need a service</span>
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/handyman/login')}
            className="w-full bg-[#FF6600] rounded-2xl px-7 py-6 flex items-center gap-4 cursor-pointer shadow-lg font-semibold text-lg text-white hover:bg-[#e05500] transition-all"
          >
            <Shield size={26} />
            <span className="flex-1 text-left">I offer services</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <p className="absolute bottom-6 text-white/40 text-xs">Connecting Professionals & Clients</p>
    </div>
  );
}
