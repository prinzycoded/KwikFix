import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Star, MapPin } from 'lucide-react';

export default function MatchingAnimation() {
  const navigate = useNavigate();
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSearching(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F9] dark:bg-gray-900 p-4 flex flex-col">
      <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full self-start">
        <ArrowLeft className="w-6 h-6 text-[#003366] dark:text-white" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        {searching ? (
          <>
            <div className="w-20 h-20 rounded-full bg-[#003366] flex items-center justify-center animate-pulse mb-6">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#003366] dark:text-white mb-2">Finding a KWIKFIXER</h2>
            <p className="text-gray-500 dark:text-gray-400">Searching for nearby professionals...</p>
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500"><Search className="w-4 h-4 animate-spin" /> Scanning available handypeople</div>
              <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin className="w-4 h-4 animate-spin" /> Checking proximity to your location</div>
            </div>
          </>
        ) : (
          <>
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#003366] dark:text-white mb-1">KWIKFIXER Found!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">A professional has been matched</p>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#003366] flex items-center justify-center text-white text-2xl font-bold">AO</div>
                <div>
                  <h3 className="text-lg font-bold text-[#003366] dark:text-white">Adebayo O.</h3>
                  <div className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /> <span className="text-gray-600 dark:text-gray-300 ml-1">4.8</span></div>
                  <div className="flex items-center gap-1 text-green-600 mt-1">
                    <CheckCircle className="w-4 h-4" /><span className="text-xs">Verified</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full ml-2" /><span className="text-xs text-green-600">Available</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Specialization: Plumbing</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Experience: 8 years</p>
            </div>

            <button
              onClick={() => navigate('/customer/handyman-profile')}
              className="mt-6 bg-[#003366] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#004488] transition-colors"
            >
              View Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
