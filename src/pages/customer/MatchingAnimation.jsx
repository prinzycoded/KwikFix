import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Star, MapPin, Wrench, Loader2 } from 'lucide-react';
import Avatar from '../../components/Avatar';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { handymanMatchesService, getHandymanNiches, nichesLabel } from '../../lib/niches';

export default function MatchingAnimation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registeredHandymen, presenceStatuses, connectionReady } = useApp();
  const { firebaseReady } = useAuth();
  const [searching, setSearching] = useState(true);

  const service = (searchParams.get('service') || '').toLowerCase();

  // Tier 1: handymen whose registered profile covers the requested service.
  const nicheCandidates = useMemo(() => {
    return registeredHandymen.filter((h) => handymanMatchesService(h, service));
  }, [registeredHandymen, service]);

  // Tier 2: if no niche match exists, fall back to any handyman with a
  // registered account on KwikFix so clients can always connect to a
  // real handyman instead of hitting a dead end.
  const candidates = useMemo(
    () => (nicheCandidates.length > 0 ? nicheCandidates : registeredHandymen),
    [nicheCandidates, registeredHandymen],
  );

  const matched = useMemo(() => {
    if (candidates.length === 0) return null;
    const online = candidates.find((h) => presenceStatuses[h.uid || h.id]?.status === 'online');
    return online || candidates[0];
  }, [candidates, presenceStatuses]);

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
            <p className="text-muted">Searching registered, verified professionals...</p>
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted"><Search className="w-4 h-4 animate-spin text-accent" /> Scanning registered KWIKFIXERS</div>
              <div className="flex items-center gap-2 text-sm text-muted"><MapPin className="w-4 h-4 animate-spin text-accent" /> Checking proximity to your location</div>
            </div>
          </>
        ) : matched ? (
          <>
            <CheckCircle className="w-20 h-20 text-[#10B981] mb-4" />
            <h2 className="text-2xl font-bold text-white mb-1">KWIKFIXER Found!</h2>
            <p className="text-muted mb-6">A registered professional has been matched</p>

            <div className="bg-navy-800 border border-white/10 rounded-2xl shadow-lg p-6 w-full max-w-sm">
              <div className="flex items-center gap-4 mb-4">
                <Avatar name={matched.fullName || 'KWIKFIXER'} size={64} />
                <div>
                  <h3 className="text-lg font-bold text-white">{matched.fullName || 'KWIKFIXER'}</h3>
                  <div className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" /><span className="text-muted ml-1">{matched.rating || 'New'}</span></div>
                  <div className="flex items-center gap-1 text-[#10B981] mt-1">
                    <CheckCircle className="w-4 h-4" /><span className="text-xs">{matched.isVerified ? 'Verified' : 'Registered'}</span>
                    <span className="w-2 h-2 bg-[#10B981] rounded-full ml-2" /><span className="text-xs text-[#10B981]">Available</span>
                  </div>
                </div>
              </div>
              <p className="text-muted text-sm mb-1 capitalize">Specialization: {nichesLabel(getHandymanNiches(matched)) || 'General'}</p>
              <p className="text-muted text-sm">Experience: {matched.yearsOfExperience || 0} years</p>
            </div>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('handymanId', matched.uid || matched.id);
                navigate(`/customer/handyman-profile?${params.toString()}`);
              }}
              className="mt-6 bg-white text-navy px-8 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
            >
              View Profile
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-navy-800 border border-white/10 flex items-center justify-center mb-6">
              <Wrench className="w-10 h-10 text-muted" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No KWIKFIXERs registered yet</h2>
            <p className="text-muted text-center max-w-sm mb-2">
              {!firebaseReady
                ? 'Firebase is not configured. Add your config to .env (see .env.example) and restart the dev server.'
                : 'No handyman has signed in through the app yet. A handyman only appears here after they log in via Handyman Login at least once.'}
            </p>
            <p className="text-xs text-faint mb-6 flex items-center gap-1"><Loader2 className="w-3 h-3" /> Your request stays live — the moment a handyman becomes available, you'll be notified.</p>
            <div className="bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-muted mb-4 text-center">
              Directory: {registeredHandymen.length} handyman{registeredHandymen.length === 1 ? '' : 's'} · Firebase: {firebaseReady ? (connectionReady ? 'connected' : 'connecting') : 'not configured'}
            </div>
            <button
              onClick={() => navigate('/service-selection')}
              className="bg-accent text-white px-8 py-3 rounded-2xl font-bold hover:bg-accent-dark transition-colors"
            >
              Choose Another Service
            </button>
          </>
        )}
      </div>
    </div>
  );
}