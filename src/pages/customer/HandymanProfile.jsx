import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, MapPin, MessageSquare, X } from 'lucide-react';

export default function HandymanProfile() {
  const navigate = useNavigate();
  const [proposedPrice, setProposedPrice] = useState(20000);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState('');

  return (
    <div className="min-h-screen bg-[#F4F4F9] dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mb-4">
          <ArrowLeft className="w-6 h-6 text-[#003366] dark:text-white" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-[#003366] flex items-center justify-center text-white text-3xl font-bold">AO</div>
                <div>
                  <h2 className="text-2xl font-bold text-[#003366] dark:text-white">Adebayo Olamide</h2>
                  <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    <span className="text-gray-600 dark:text-gray-300 ml-1">4.8</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" /><span className="text-xs text-green-600">Verified</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full ml-2" /><span className="text-xs text-green-600">Available</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Plumbing · 8 years experience</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">Photo {i}</div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-[#003366] dark:text-white mb-3">Price Estimate</h3>
              <div className="bg-[#F4F4F9] dark:bg-gray-700 rounded-xl p-4 mb-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Market Research: ₦15,000 - ₦25,000</p>
                <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <p>• Senior qualification level: +₦5,000</p>
                  <p>• Customer provides tools: -₦2,000</p>
                  <p className="font-bold text-[#003366] dark:text-white pt-1">Estimated: ₦18,000 - ₦23,000</p>
                </div>
              </div>
              <label className="text-sm font-semibold text-[#003366] dark:text-white mb-2 block">Proposed Price: ₦{proposedPrice.toLocaleString()}</label>
              <input type="range" min={5000} max={50000} step={500} value={proposedPrice} onChange={(e) => setProposedPrice(Number(e.target.value))} className="w-full accent-[#FF6600]" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>₦5,000</span><span>₦50,000</span></div>
            </div>

            <div className="space-y-3">
              <button onClick={() => navigate('/customer/chat/handyman-1')} className="w-full bg-[#FF6600] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e05500]">
                <MessageSquare className="w-5 h-5" /> Chat with Handyman
              </button>
              <button onClick={() => setShowConfirmModal(true)} className="w-full bg-[#003366] text-white py-3 rounded-xl font-bold hover:bg-[#004488]">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowConfirmModal(false)} className="float-right"><X className="w-5 h-5 text-gray-500" /></button>
            <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-3 mt-2">Enter Agreed Price</h3>
            <input type="number" value={agreedPrice} onChange={(e) => setAgreedPrice(e.target.value)} placeholder="e.g. 20000" className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#003366]" />
            <button onClick={() => { if (agreedPrice) { setShowConfirmModal(false); navigate('/customer/success'); } }} className="w-full bg-[#003366] text-white py-3 rounded-xl font-bold hover:bg-[#004488]">Submit Agreement</button>
          </div>
        </div>
      )}
    </div>
  );
}
