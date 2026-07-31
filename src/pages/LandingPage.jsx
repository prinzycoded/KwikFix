import { useNavigate } from 'react-router-dom';
import { Wrench, Shield, ArrowRight, Star, Users, Zap, MapPin, Clock, CheckCircle, Search } from 'lucide-react';
import heroImg from '../assets/Kwik.img.png';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#003366]">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left: Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-md flex flex-col items-center lg:items-start">

            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-8 h-8 text-[#FF6600]" />
              <span className="text-3xl font-bold text-white">
                Kwik<span className="text-[#FF6600]">Fix</span>
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white text-center lg:text-left leading-tight">
              Your Home.
              <br />
              <span className="text-[#FF6600]">Our Pros.</span>
            </h1>

            <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-sm text-center lg:text-left">
              We connect you with trusted, vetted handymen in your area — so you can fix, build, and improve your home without the hassle.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-sm">
              {[
                { icon: Star, label: 'Verified Pros', color: 'text-[#FFD54F]' },
                { icon: Zap, label: 'Fast Matching', color: 'text-[#FF6600]' },
                { icon: Users, label: 'Local Experts', color: 'text-[#4FC3F7]' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm hover:bg-white/20 hover:scale-110 transition-all duration-200">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span className="text-white/60 text-[10px] text-center leading-tight font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="w-full flex flex-col gap-3 mt-8 max-w-sm">
              <button
                onClick={() => navigate('/service-selection')}
                className="w-full bg-white rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer shadow-lg font-semibold text-base text-[#003366] hover:bg-gray-50 transition-all active:scale-[0.98] group"
              >
                <div className="bg-[#003366]/10 rounded-xl p-2">
                  <Search size={20} className="text-[#003366]" />
                </div>
                <span className="flex-1 text-left">Looking For Service</span>
                <ArrowRight size={18} className="text-[#003366]/40 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/handyman/login')}
                className="w-full bg-[#FF6600] rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer shadow-lg font-semibold text-base text-white hover:bg-[#e05500] transition-all active:scale-[0.98] group"
              >
                <div className="bg-white/20 rounded-xl p-2">
                  <Shield size={20} className="text-white" />
                </div>
                <span className="flex-1 text-left">Offering Service</span>
                <ArrowRight size={18} className="text-white/60 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-5 mt-6 text-white/40 text-xs flex-wrap justify-center lg:justify-start">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> Abia state,Nigeria.
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> Avg. 15min response
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={12} /> 4.8 ★ rating
              </span>
            </div>

            <p className="text-white/20 text-xs mt-8 pb-4 text-center lg:text-left">Connecting Professionals & Clients</p>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="relative flex-1 min-h-[40vh] lg:min-h-screen overflow-hidden">
          <img
            src={heroImg}
            alt="Professional handyman tools and equipment"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003366] via-[#003366]/30 to-transparent lg:bg-gradient-to-r lg:from-[#003366] lg:via-[#003366]/50 lg:to-transparent" />
        </div>
      </div>
    </div>
  );
}
