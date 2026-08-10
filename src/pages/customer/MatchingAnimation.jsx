import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Star, MapPin } from 'lucide-react';
import Avatar from '../../components/Avatar';

export default function MatchingAnimation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSearching(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-navy p-4 flex flex-col">
      <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full self-start">
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        {searching ? (
          <>
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center animate-pulse mb-6">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Finding a KWIKFIXER</h2>
            <p className="text-muted">Searching for nearby professionals...</p>
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted"><Search className="w-4 h-4 animate-spin text-accent" /> Scanning available KWIKFIXERS</div>
              <div className="flex items-center gap-2 text-sm text-muted"><MapPin className="w-4 h-4 animate-spin text-accent" /> Checking proximity to your location</div>
            </div>
          </>
        ) : (
          <>
            <CheckCircle className="w-20 h-20 text-[#10B981] mb-4" />
            <h2 className="text-2xl font-bold text-white mb-1">KWIKFIXER Found!</h2>
            <p className="text-muted mb-6">A professional has been matched</p>

            <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-lg p-6 w-full max-w-sm">
              <div className="flex items-center gap-4 mb-4">
                <Avatar name="Adebayo Olamide" size={64} />
                <div>
                  <h3 className="text-lg font-bold text-white">Adebayo O.</h3>
                  <div className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /> <span className="text-muted ml-1">4.8</span></div>
                  <div className="flex items-center gap-1 text-[#10B981] mt-1">
                    <CheckCircle className="w-4 h-4" /><span className="text-xs">Verified</span>
                    <span className="w-2 h-2 bg-[#10B981] rounded-full ml-2" /><span className="text-xs text-[#10B981]">Available</span>
                  </div>
                </div>
              </div>
              <p className="text-muted text-sm mb-1">Specialization: Plumbing</p>
              <p className="text-muted text-sm">Experience: 8 years</p>
            </div>

            <button
              onClick={() => { const q = searchParams.toString(); navigate(`/customer/handyman-profile${q ? `?${q}` : ''}`) }}
              className="mt-6 bg-white text-navy px-8 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
            >
              View Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
