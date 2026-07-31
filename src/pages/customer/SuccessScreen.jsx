import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function SuccessScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F4F4F9] dark:bg-gray-900 p-4 flex flex-col">
      <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full self-start">
        <ArrowLeft className="w-6 h-6 text-[#003366] dark:text-white" />
      </button>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#003366] dark:text-white mb-1">Booking Confirmed!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Your KWIKFIXER is on the way</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-sm mb-8">
          <div className="border-b dark:border-gray-700 pb-3 mb-3">
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-bold text-[#003366] dark:text-white">Plumbing</p>
          </div>
          <div className="border-b dark:border-gray-700 pb-3 mb-3">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-bold text-[#003366] dark:text-white">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Agreed Price</p>
            <p className="font-bold text-[#FF6600]">₦20,000</p>
          </div>
          <div className="mt-4 pt-3 border-t dark:border-gray-700">
            <p className="text-xs text-gray-400">Tracking: KFX-2024-00A23</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/customer/dashboard')}
          className="w-full max-w-sm bg-[#003366] text-white py-3 rounded-xl font-bold hover:bg-[#004488]"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
