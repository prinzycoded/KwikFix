import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Briefcase, User, Settings, Bell, Star, CheckCircle,
  Clock, MapPin, ChevronDown, ChevronUp, Award, TrendingUp,
  Shield, Circle, LogOut, Zap, AlertTriangle, Plus, Send,
  ThumbsUp, Calendar, Wallet, Moon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

const MOCK_JOBS = [
  { id: 'job1', bookingId: 'b1', handymanId: '', customerId: 'c1', title: 'Fix Kitchen Sink', description: 'Leaking pipe under kitchen sink needs repair', status: 'available', payment: 15000, toolsRequired: false, commissionFee: 300, earningsAfterCommission: 14700, serviceType: 'Plumbing', location: 'Ikeja, Lagos', offeredPrice: 14700, originalPrice: 15000 },
  { id: 'job2', bookingId: 'b2', handymanId: '', customerId: 'c2', title: 'Electrical Wiring', description: 'New wiring for 3-bedroom apartment', status: 'available', payment: 35000, toolsRequired: true, commissionFee: 700, earningsAfterCommission: 34300, serviceType: 'Electrical', location: 'Victoria Island, Lagos', offeredPrice: 34300, originalPrice: 35000 },
  { id: 'job3', bookingId: 'b3', handymanId: '', customerId: 'c3', title: 'Wardrobe Assembly', description: 'Assemble IKEA wardrobe', status: 'available', payment: 12000, toolsRequired: false, commissionFee: 240, earningsAfterCommission: 11760, serviceType: 'Carpentry', location: 'Lekki, Lagos', offeredPrice: 11760, originalPrice: 12000 },
  { id: 'job4', bookingId: 'b4', handymanId: '', customerId: 'c4', title: 'Car Oil Change', description: 'Full oil change and filter replacement', status: 'available', payment: 8000, toolsRequired: true, commissionFee: 160, earningsAfterCommission: 7840, serviceType: 'Mechanic', location: 'Yaba, Lagos', offeredPrice: 7840, originalPrice: 8000 },
  { id: 'job5', bookingId: 'b5', handymanId: 'h1', customerId: 'c5', title: 'AC Repair', description: 'Split AC not cooling', status: 'active', payment: 25000, toolsRequired: true, commissionFee: 500, earningsAfterCommission: 24500, serviceType: 'Electrical', location: 'Surulere, Lagos', offeredPrice: 24500, originalPrice: 25000, clientName: 'Mr. Adekunle', clientAddress: '12, Awolowo Road, Surulere', timer: '02:30:00' },
  { id: 'job6', bookingId: 'b6', handymanId: 'h1', customerId: 'c6', title: 'Door Hinge Repair', description: 'Sagging door needs hinge replacement', status: 'active', payment: 5000, toolsRequired: false, commissionFee: 100, earningsAfterCommission: 4900, serviceType: 'Carpentry', location: 'Gbagada, Lagos', offeredPrice: 4900, originalPrice: 5000, clientName: 'Mrs. Bello', clientAddress: '45, College Road, Gbagada', timer: '01:15:00' },
  { id: 'job7', bookingId: 'b7', handymanId: 'h1', customerId: 'c7', title: 'Pipe Replacement', description: 'Replaced burst pipe in bathroom', status: 'past', payment: 18000, toolsRequired: true, commissionFee: 360, earningsAfterCommission: 17640, serviceType: 'Plumbing', location: 'Ikeja, Lagos', offeredPrice: 17640, originalPrice: 18000, clientName: 'Engr. Okonkwo', clientAddress: '8, Unity Road, Ikeja', rating: 5 },
  { id: 'job8', bookingId: 'b8', handymanId: 'h1', customerId: 'c8', title: 'Ceiling Fan Installation', description: 'Installed ceiling fan in living room', status: 'past', payment: 10000, toolsRequired: true, commissionFee: 200, earningsAfterCommission: 9800, serviceType: 'Electrical', location: 'Magodo, Lagos', offeredPrice: 9800, originalPrice: 10000, clientName: 'Dr. Adeleke', clientAddress: '22, Green Avenue, Magodo', rating: 4 },
];

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'new_job', message: 'New plumbing job available in Ikeja', read: false, createdAt: '2026-07-21T10:30:00Z' },
  { id: 'n2', type: 'rating', message: 'Engr. Okonkwo rated you 5 stars!', read: false, createdAt: '2026-07-20T14:00:00Z' },
  { id: 'n3', type: 'price_agreed', message: 'Price agreed for AC Repair job', read: true, createdAt: '2026-07-19T09:15:00Z' },
  { id: 'n4', type: 'job_end', message: 'Pipe Replacement job completed successfully', read: true, createdAt: '2026-07-18T16:45:00Z' },
];

function HandymanDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const { markAsRead } = useApp();

  const [activeTab, setActiveTab] = useState('home');
  const [jobsSubTab, setJobsSubTab] = useState('available');
  const [userStatus, setUserStatus] = useState('online');
  const [selectedJob, setSelectedJob] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [endJobState, setEndJobState] = useState({});
  const [endJobResult, setEndJobResult] = useState(null);
  const [showDIYModal, setShowDIYModal] = useState(false);

  const toggleStatus = () => {
    setUserStatus((prev) => (prev === 'online' ? 'working' : 'online'));
  };

  const handleEndJob = (jobId) => {
    if (endJobState[jobId]) {
      setEndJobResult('success');
      setTimeout(() => setEndJobResult(null), 3000);
      return;
    }
    setEndJobState((prev) => ({ ...prev, [jobId]: true }));
    setEndJobResult('waiting');
    setTimeout(() => {
      const simulatedBothEnded = Math.random() > 0.5;
      if (simulatedBothEnded) {
        setEndJobResult('success');
        setEndJobState((prev) => ({ ...prev, [jobId]: true }));
      } else {
        setEndJobResult('waiting_other');
      }
      setTimeout(() => setEndJobResult(null), 4000);
    }, 2000);
  };

  const openNegotiation = (job) => {
    setSelectedJob(job.id);
    setShowNegotiation(true);
    setChatMessages([
      { sender: 'client', text: `Hello, I need help with: ${job.title}`, time: '10:30 AM' },
      { sender: 'client', text: 'Can you do this job?', time: '10:31 AM' },
      { sender: 'handyman', text: 'Yes, I can handle that. When would you like me to come?', time: '10:32 AM' },
    ]);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'handyman', text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  const formatAmount = (amount) => `NGN ${amount.toLocaleString()}`;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
    ));

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const renderHomeTab = () => (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-[#003366] dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm cursor-pointer" onClick={toggleStatus}>
          <Circle size={10} className={userStatus === 'online' ? 'text-[#10B981] fill-[#10B981]' : 'text-[#EF4444] fill-[#EF4444]'} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userStatus === 'online' ? 'Available' : 'Working'}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#003366] to-[#002244] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm opacity-80">Wallet Balance</p>
          <CheckCircle size={20} className="text-[#10B981]" />
        </div>
        <h2 className="text-3xl font-bold mb-1">{formatAmount(45200)}</h2>
        <p className="text-xs opacity-60 mb-4">Available for withdrawal</p>
        <button onClick={() => navigate('/handyman/withdraw')} className="w-full md:w-auto py-3 px-8 bg-[#FF6600] text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-all shadow-lg">
          <div className="flex items-center justify-center gap-2"><Wallet size={16} /> Withdraw Funds</div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#FF6600]/10 flex items-center justify-center mb-3"><Briefcase size={20} className="text-[#FF6600]" /></div>
          <p className="text-2xl font-bold text-[#003366] dark:text-white">6</p>
          <p className="text-sm text-gray-500">Active Jobs</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3"><TrendingUp size={20} className="text-[#10B981]" /></div>
          <p className="text-2xl font-bold text-[#003366] dark:text-white">4.8</p>
          <p className="text-sm text-gray-500">Performance Rating</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-1 mb-1">{renderStars(5)}<span className="text-xs text-gray-400 ml-1">(24 reviews)</span></div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><Shield size={14} className="inline text-[#10B981] mr-1" />Verified Handyman</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-[#003366] dark:text-white text-lg mb-3 flex items-center gap-2"><Bell size={18} />Recent Notifications</h3>
        <div className="space-y-2">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${notif.read ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700' : 'bg-[#FF6600]/5 border-[#FF6600]/20'}`}>
              <Bell size={18} className={`mt-0.5 ${notif.read ? 'text-gray-300' : 'text-[#FF6600]'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notif.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200 font-medium'}`}>{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notif.createdAt)}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-[#FF6600] mt-2 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAvailableJobs = () => (
    <div className="space-y-3">
      {MOCK_JOBS.filter((j) => j.status === 'available').map((job) => (
        <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 cursor-pointer" onClick={() => selectedJob === job.id ? setSelectedJob(null) : openNegotiation(job)}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">{job.title}</h4>
                <div className="flex items-center gap-1 mt-1"><Zap size={14} className="text-[#FF6600]" /><span className="text-xs text-gray-500">{job.serviceType}</span></div>
              </div>
              {selectedJob === job.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3"><MapPin size={12} />{job.location}</div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-[#003366] dark:text-white">{formatAmount(job.offeredPrice)}</p>
                <p className="text-xs text-gray-400 line-through">{formatAmount(job.originalPrice)}</p>
                <p className="text-[10px] text-[#10B981] font-medium mt-0.5">After 2% commission: {formatAmount(job.earningsAfterCommission)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Earnings</p>
                <p className="text-sm font-bold text-[#10B981]">{formatAmount(job.earningsAfterCommission)}</p>
              </div>
            </div>
          </div>
          {selectedJob === job.id && showNegotiation && (
            <div className="border-t dark:border-gray-700">
              <div className="p-4 bg-[#F4F4F4]/50 dark:bg-gray-700/50">
                <div className="h-48 overflow-y-auto space-y-3 mb-3">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'handyman' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.sender === 'handyman' ? 'bg-[#FF6600] text-white' : 'bg-white dark:bg-gray-600 border dark:border-gray-500 text-gray-700 dark:text-gray-200'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender === 'handyman' ? 'text-white/70' : 'text-gray-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6600] text-sm bg-white" />
                  <button onClick={sendMessage} className="w-10 h-10 rounded-xl bg-[#FF6600] text-white flex items-center justify-center hover:bg-orange-600"><Send size={16} /></button>
                </div>
              </div>
              <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                <button className="w-full py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-semibold hover:bg-emerald-600">Accept Job - {formatAmount(job.offeredPrice)}</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderActiveJobs = () => (
    <div className="space-y-3">
      {MOCK_JOBS.filter((j) => j.status === 'active').map((job) => (
        <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200">{job.title}</h4>
              <div className="flex items-center gap-1 mt-1"><User size={12} className="text-gray-400" /><span className="text-xs text-gray-500">{job.clientName}</span></div>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#FF6600]"><Clock size={16} />{job.timer}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3"><MapPin size={12} />{job.clientAddress}</div>
          <div className="flex items-center justify-between py-2 border-t dark:border-gray-700">
            <p className="font-bold text-[#003366] dark:text-white">{formatAmount(job.agreedPrice || job.offeredPrice)}</p>
            <button onClick={() => handleEndJob(job.id)} className="px-5 py-2 bg-[#EF4444] text-white rounded-lg text-sm font-semibold hover:bg-red-600">End Job</button>
          </div>
        </div>
      ))}
      {endJobResult && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 max-w-sm p-4 rounded-xl shadow-lg z-50 ${endJobResult === 'success' ? 'bg-[#10B981] text-white' : 'bg-amber-500 text-white'}`}>
          <div className="flex items-center gap-2">
            {endJobResult === 'success' ? <><ThumbsUp size={18} /><p className="text-sm font-medium">Job ended successfully!</p></> : <><AlertTriangle size={18} /><p className="text-sm font-medium">{endJobResult === 'waiting' ? 'Waiting for the other party...' : 'Only one party ended the job.'}</p></>}
          </div>
        </div>
      )}
    </div>
  );

  const renderPastJobs = () => (
    <div className="space-y-3">
      {MOCK_JOBS.filter((j) => j.status === 'past').map((job) => (
        <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200">{job.title}</h4>
              <div className="flex items-center gap-1 mt-1"><User size={12} className="text-gray-400" /><span className="text-xs text-gray-500">{job.clientName}</span></div>
            </div>
            <div className="flex items-center gap-1">{job.rating && renderStars(job.rating)}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><Calendar size={12} />Completed</div>
          <div className="flex items-center justify-between py-2 border-t dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-400">Earnings</p>
              <p className="font-bold text-[#10B981]">{formatAmount(job.earningsAfterCommission)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Commission</p>
              <p className="text-sm text-gray-500">-{formatAmount(job.commissionFee)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderJobsTab = () => (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-[#003366] dark:text-white mb-4">Jobs</h1>
      <div className="flex gap-1 mb-4 bg-[#F4F4F4] dark:bg-gray-700 rounded-xl p-1 w-fit">
        {(['available', 'active', 'past']).map((sub) => (
          <button key={sub} onClick={() => { setJobsSubTab(sub); setSelectedJob(null); setShowNegotiation(false); }} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${jobsSubTab === sub ? 'bg-white dark:bg-gray-600 text-[#FF6600] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
            {sub === 'available' ? 'Available' : sub === 'active' ? 'Active' : 'Past Jobs'}
          </button>
        ))}
      </div>
      {jobsSubTab === 'available' && renderAvailableJobs()}
      {jobsSubTab === 'active' && renderActiveJobs()}
      {jobsSubTab === 'past' && renderPastJobs()}
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#003366] dark:text-white">Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700 shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-[#FF6600]/10 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-[#FF6600]">{currentUser?.fullName?.charAt(0) || 'H'}</span>
        </div>
        <h3 className="text-lg font-bold text-[#003366] dark:text-white">{currentUser?.fullName || 'Handyman'}</h3>
        <p className="text-sm text-gray-500">Handyman</p>
        <div className="flex items-center justify-center gap-1 mt-2">{renderStars(5)}<span className="text-xs text-gray-400 ml-1">4.8</span></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden">
        <button onClick={() => navigate('/handyman/portfolio')} className="w-full flex items-center gap-3 p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
          <Plus size={20} className="text-gray-500" />
          <div><p className="text-sm font-medium text-gray-800 dark:text-gray-200">My Portfolio</p><p className="text-xs text-gray-400">View and manage work images</p></div>
        </button>
        <button onClick={() => navigate('/handyman/withdraw')} className="w-full flex items-center gap-3 p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
          <Wallet size={20} className="text-gray-500" />
          <div><p className="text-sm font-medium text-gray-800 dark:text-gray-200">Withdraw Funds</p><p className="text-xs text-gray-400">Withdraw your earnings</p></div>
        </button>
        <button onClick={() => navigate('/handyman/settings')} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
          <Settings size={20} className="text-gray-500" />
          <div><p className="text-sm font-medium text-gray-800 dark:text-gray-200">Settings</p><p className="text-xs text-gray-400">Account and app settings</p></div>
        </button>
      </div>
    </div>
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex gap-1 mb-6 bg-[#F4F4F4] dark:bg-gray-700 rounded-xl p-1 w-fit">
        {(['home', 'jobs', 'profile']).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-600 text-[#FF6600] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>
            {tab === 'home' ? 'Home' : tab === 'jobs' ? 'Jobs' : 'Profile'}
          </button>
        ))}
      </div>

      {activeTab === 'home' && renderHomeTab()}
      {activeTab === 'jobs' && renderJobsTab()}
      {activeTab === 'profile' && renderProfileTab()}

      {showDIYModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4"><Award size={32} className="text-amber-500" /></div>
            <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-2">Premium Feature</h3>
            <p className="text-sm text-gray-500 mb-6">DIY Professional is a premium feature. Upgrade your account to access exclusive tools and higher-paying jobs.</p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
              <p className="text-sm font-semibold text-amber-800">Paywall: NGN 5,000/month</p>
              <p className="text-xs text-amber-600 mt-1">Unlock premium features and get priority job listings</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDIYModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">Cancel</button>
              <button className="flex-1 py-2.5 bg-[#FF6600] text-white rounded-xl text-sm font-semibold hover:bg-orange-600">Upgrade Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandymanDashboard;
