import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';

const BRAND = {
  DEEP_BLUE: '#003366',
  VIBRANT_ORANGE: '#FF6600',
  LIGHT_GREY: '#F4F4F4',
};

export default function ActiveJobScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [endState, setEndState] = useState('none');
  const [locationState, setLocationState] = useState('stopped');
  const [notifications, setNotifications] = useState([]);

  const job = {
    id: id ?? 'unknown',
    serviceType: 'Plumbing',
    providerName: 'John Doe',
    clientName: 'Jane Smith',
    address: '123 Main Street, Lagos',
    agreedPrice: 25000,
    time: '2:30 PM',
    role: 'customer',
  };

  const addNotification = (msg) => {
    setNotifications((prev) => [...prev, msg]);
  };

  const handleEndJob = (clickedBy) => {
    if (endState === 'none') {
      if (clickedBy === 'customer') { setEndState('customer_ended'); addNotification('Waiting for handyman to confirm job ended'); }
      else { setEndState('handyman_ended'); addNotification('Waiting for customer to confirm job ended'); }
    } else if (endState === 'customer_ended' && clickedBy === 'handyman') { setEndState('both_ended'); addNotification('Job Completed!'); }
    else if (endState === 'handyman_ended' && clickedBy === 'customer') { setEndState('both_ended'); addNotification('Job Completed!'); }
  };

  const handleToggleLocation = () => {
    if (locationState === 'stopped') { setLocationState('shared'); addNotification('Location shared with both parties'); }
    else { setLocationState('stopped'); addNotification('Location sharing stopped'); }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-[#003366]" />
        </button>
        <h1 className="text-2xl font-bold text-[#003366] dark:text-white">Active Job</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#003366] dark:text-white mb-4">{job.serviceType} Service</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Provider</p><p className="font-medium text-gray-800 dark:text-gray-200">{job.providerName}</p></div>
              <div><p className="text-sm text-gray-500">Client</p><p className="font-medium text-gray-800 dark:text-gray-200">{job.clientName}</p></div>
              <div className="col-span-2"><p className="text-sm text-gray-500">Address</p><p className="font-medium text-gray-800 dark:text-gray-200">{job.address}</p></div>
              <div><p className="text-sm text-gray-500">Agreed Price</p><p className="font-bold text-[#FF6600]">₦{job.agreedPrice.toLocaleString()}</p></div>
              <div><p className="text-sm text-gray-500">Time</p><p className="font-medium text-gray-800 dark:text-gray-200">{job.time}</p></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-4">End Job</h3>
            {endState === 'none' && <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4"><Clock size={20} className="text-[#003366]" /><span className="text-[#003366] font-medium">Work in progress</span></div>}
            {endState === 'customer_ended' && <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-4"><Clock size={20} className="text-[#FF6600]" /><span className="text-[#FF6600] font-medium">Waiting for handyman to confirm</span></div>}
            {endState === 'handyman_ended' && <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-4"><Clock size={20} className="text-[#FF6600]" /><span className="text-[#FF6600] font-medium">Waiting for customer to confirm</span></div>}
            {endState === 'both_ended' && <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4"><CheckCircle size={20} className="text-green-600" /><span className="text-green-600 font-medium">Job Completed!</span></div>}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => handleEndJob('customer')} disabled={endState === 'both_ended'} className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white ${endState === 'both_ended' ? 'bg-gray-300' : 'bg-[#003366] hover:bg-[#004488]'} ${endState === 'customer_ended' ? 'opacity-50' : ''}`}><XCircle size={18} />End Job (Customer)</button>
              <button onClick={() => handleEndJob('handyman')} disabled={endState === 'both_ended'} className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white ${endState === 'both_ended' ? 'bg-gray-300' : 'bg-[#FF6600] hover:bg-[#e05500]'} ${endState === 'handyman_ended' ? 'opacity-50' : ''}`}><XCircle size={18} />End Job (Handyman)</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-4">Location Tracking</h3>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className={locationState === 'shared' ? 'text-green-600' : 'text-gray-400'} />
              <span className={`font-medium ${locationState === 'shared' ? 'text-green-600' : 'text-gray-500'}`}>
                {locationState === 'shared' ? 'Location Shared' : 'Location Not Shared'}
              </span>
            </div>
            <button onClick={handleToggleLocation} className="w-full py-3 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#004488]">
              {locationState === 'stopped' ? 'Share Location' : 'Stop Sharing'}
            </button>
          </div>

          {notifications.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-3">Notifications</h3>
              <div className="space-y-2">
                {notifications.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg flex items-center gap-2 text-sm ${msg === 'Job Completed!' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                    {msg === 'Job Completed!' ? <CheckCircle size={16} className="text-green-600" /> : <Clock size={16} className="text-[#FF6600]" />}
                    <span className="text-gray-700 dark:text-gray-300">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
