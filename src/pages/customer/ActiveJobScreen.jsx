import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, Clock, XCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../lib/format';

const timeOptionLabels = {
  '15': 'within 15 mins',
  '30': 'within 30 mins',
  '60': 'within 1 hour',
  '120': 'within 2 hours',
  '240': 'within 4 hours',
  flexible: 'at a flexible time',
};

export default function ActiveJobScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, jobs, assignedBookings, endJob, addNotification } = useApp();
  const { currentUser, userRole } = useAuth();

  const [locationState, setLocationState] = useState('stopped');
  const [notifications, setNotifications] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const isHandyman = userRole === 'handyman';
  const liveBacking = assignedBookings[id];
  const record = bookings.find((b) => b.id === id) || jobs.find((j) => j.id === id);
  const endState = liveBacking?.endState || record?.endState || 'none';
  const bookingStatus = liveBacking?.status || record?.status || '';

  const job = (liveBacking || record)
    ? {
        id: (liveBacking || record).id,
        serviceType: (liveBacking || record).service || 'Service',
        providerName: (liveBacking || record).handymanName || 'KWIKFIXER',
        clientName: (liveBacking || record).customerName || currentUser?.fullName || 'You',
        address: (liveBacking || record).address || 'Umuahia, Abia State',
        agreedPrice: (liveBacking || record).price || 0,
        time: timeOptionLabels[(liveBacking || record).time] || (liveBacking || record).time || 'Flexible',
        date: (liveBacking || record).date || '',
      }
    : {
        id: id ?? 'unknown',
        serviceType: 'Plumbing',
        providerName: 'Adebayo Olamide',
        clientName: 'Chiamaka Eze',
        address: '12, Azikiwe Road, Umuahia, Abia State',
        agreedPrice: 25000,
        time: '10:00 AM',
        date: '',
      };

  const addLocalNotification = (msg) => {
    setNotifications((prev) => [...prev, msg]);
  };

  const handleEndJob = async (clickedBy) => {
    if (bookingStatus === 'completed' || endState === 'both_ended' || submitting) return;
    setSubmitting(true);
    try {
      await endJob(id, clickedBy);
      if (endState === 'none') {
        addLocalNotification(clickedBy === 'customer'
          ? 'Waiting for handyman to confirm job ended'
          : 'Waiting for customer to confirm job ended');
        await addNotification(clickedBy === 'customer'
          ? { type: 'job_end', message: 'Waiting for handyman to confirm job ended' }
          : { type: 'job_end', message: 'Waiting for customer to confirm job ended' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLocation = () => {
    if (locationState === 'stopped') { setLocationState('shared'); addLocalNotification('Location shared with both parties'); }
    else { setLocationState('stopped'); addLocalNotification('Location sharing stopped'); }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const isCompleted = bookingStatus === 'completed' || endState === 'both_ended';

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Active Job</h1>
        {isCompleted && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold">
            <CheckCircle size={13} /> Completed
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">{job.serviceType} Service</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-muted">Provider</p><div className="flex items-center gap-1.5 font-medium text-white">{job.providerName}{job.providerName !== 'KWIKFIXER' && <ShieldCheck size={14} className="text-[#10B981]" />}</div></div>
              <div><p className="text-sm text-muted">Client</p><p className="font-medium text-white">{job.clientName}</p></div>
              <div className="col-span-2"><p className="text-sm text-muted">Address</p><p className="font-medium text-white">{job.address}</p></div>
              <div><p className="text-sm text-muted">Agreed Price</p><p className="font-bold text-accent">₦{Number(job.agreedPrice || 0).toLocaleString()}</p></div>
              <div><p className="text-sm text-muted">Time</p><p className="font-medium text-white capitalize">{job.time}</p></div>
              {job.date && (
                <div><p className="text-sm text-muted">Scheduled Date</p><p className="font-medium text-white">{formatDate(job.date)}</p></div>
              )}
            </div>
            <button
              onClick={() => navigate(`/${isHandyman ? 'handyman' : 'customer'}/chat/${id}`)}
              className="mt-5 w-full sm:w-auto py-2.5 px-5 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-dark flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} /> Chat with {isHandyman ? 'Customer' : 'Handyman'}
            </button>
          </div>

          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">End Job</h3>
            {endState === 'none' && !isCompleted && <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg mb-4"><Clock size={20} className="text-accent" /><span className="text-white font-medium">Work in progress</span></div>}
            {endState === 'customer_ended' && <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/30 rounded-lg mb-4"><Clock size={20} className="text-accent" /><span className="text-accent font-medium">Waiting for handyman to confirm</span></div>}
            {endState === 'handyman_ended' && <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/30 rounded-lg mb-4"><Clock size={20} className="text-accent" /><span className="text-accent font-medium">Waiting for customer to confirm</span></div>}
            {isCompleted && <div className="flex items-center gap-2 p-3 bg-[#10B981]/15 border border-[#10B981]/30 rounded-lg mb-4"><CheckCircle size={20} className="text-[#10B981]" /><span className="text-[#10B981] font-medium">Job Completed!</span></div>}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => handleEndJob('customer')} disabled={isCompleted || submitting} className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold ${isCompleted ? 'bg-white/10 text-white/40' : 'bg-white text-navy hover:bg-slate-100'} ${endState === 'customer_ended' ? 'opacity-50' : ''}`}><XCircle size={18} />End Job (Customer)</button>
              <button onClick={() => handleEndJob('handyman')} disabled={isCompleted || submitting} className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white ${isCompleted ? 'bg-white/10 text-white/40' : 'bg-accent hover:bg-accent-dark'} ${endState === 'handyman_ended' ? 'opacity-50' : ''}`}><XCircle size={18} />End Job (Handyman)</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Location Tracking</h3>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className={locationState === 'shared' ? 'text-[#10B981]' : 'text-faint'} />
              <span className={`font-medium ${locationState === 'shared' ? 'text-[#10B981]' : 'text-muted'}`}>
                {locationState === 'shared' ? 'Location Shared' : 'Location Not Shared'}
              </span>
            </div>
            <button onClick={handleToggleLocation} className="w-full py-3 bg-white text-navy rounded-xl font-bold hover:bg-slate-100">
              {locationState === 'stopped' ? 'Share Location' : 'Stop Sharing'}
            </button>
          </div>

          {notifications.length > 0 && (
            <div className="bg-navy-800 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Notifications</h3>
              <div className="space-y-2">
                {notifications.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg flex items-center gap-2 text-sm ${msg === 'Job Completed!' ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-accent/10 text-slate-200'}`}>
                    {msg === 'Job Completed!' ? <CheckCircle size={16} className="text-[#10B981]" /> : <Clock size={16} className="text-accent" />}
                    <span>{msg}</span>
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