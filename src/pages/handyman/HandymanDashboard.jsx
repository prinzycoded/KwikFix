import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Briefcase, User, Settings, Bell, Star, CheckCircle,
  Clock, MapPin, ChevronDown, ChevronUp, Award, TrendingUp,
  Shield, Circle, Zap, AlertTriangle, Plus, Send,
  ThumbsUp, Calendar, Wallet, Wrench, History, Loader2, Navigation,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { formatNaira, timeAgo } from '../../lib/format';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import useLiveTracking from '../../hooks/useLiveTracking';

const COMMISSION_RATE = 0.02;

function ActiveJobCard({ job, onOpen, onEnd }) {
  const live = useLiveTracking(job.tracking);
  const hasTracking = live.status && live.status !== 'none';
  return (
    <div className="bg-navy-800 rounded-xl border border-white/10 shadow-sm p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-white">{job.title}</h4>
          <div className="flex items-center gap-1 mt-1"><User size={12} className="text-muted" /><span className="text-xs text-muted">{job.clientName}</span></div>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-accent"><Clock size={16} />Live</div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted mb-3"><MapPin size={12} />{job.location}</div>
      {hasTracking && live.status !== 'arrived' && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-accent/10 border border-accent/20 mb-3">
          <p className="text-xs text-accent font-medium flex items-center gap-1"><Navigation size={13} />En route to customer</p>
          <p className="text-sm font-bold text-accent">~{live.etaMinutes} min</p>
        </div>
      )}
      {hasTracking && live.status === 'arrived' && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 mb-3">
          <p className="text-xs text-[#10B981] font-medium flex items-center gap-1"><MapPin size={13} />Arrived at location</p>
        </div>
      )}
      <div className="flex items-center justify-between py-2 border-t border-white/10">
        <p className="font-bold text-white">{formatNaira(job.offeredPrice)}</p>
        <div className="flex gap-2">
          <button onClick={onOpen} className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark">Open Job</button>
          <button onClick={onEnd} className="px-5 py-2 bg-[#EF4444] text-white rounded-lg text-sm font-semibold hover:bg-red-600">End Job</button>
        </div>
      </div>
    </div>
  );
}

function withCommission(job) {
  const commissionFee = Math.round((job.price || 0) * COMMISSION_RATE);
  return {
    ...job,
    title: job.service || 'Service Job',
    location: job.address || 'Umuahia, Abia State',
    clientName: job.customerName || 'Customer',
    offeredPrice: job.price || 0,
    originalPrice: job.price || 0,
    earningsAfterCommission: (job.price || 0) - commissionFee,
    commissionFee,
    serviceType: job.service || 'General',
  };
}

function HandymanDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    availableJobs,
    jobs,
    assignedBookings,
    notifications,
    markAsRead,
    acceptJob,
    endJob,
    setUserStatus,
    connectionReady,
  } = useApp();

  const [activeTab, setActiveTab] = useState('home');
  const [jobsSubTab, setJobsSubTab] = useState('available');
  const [userStatus, setUserStatusLocal] = useState('online');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);
  const [endJobResult, setEndJobResult] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [showDIYModal, setShowDIYModal] = useState(false);

  const liveMode = connectionReady;

  const jobsLive = jobs.map((j) => ({
    ...j,
    endState: assignedBookings[j.id]?.endState || j.endState,
    status: assignedBookings[j.id]?.status || j.status,
    tracking: assignedBookings[j.id]?.tracking || j.tracking,
  }));

  const available = availableJobs.map(withCommission);
  const activeJobs = jobsLive
    .filter((j) => (j.status === 'active' || j.status === 'accepted') && j.endState !== 'both_ended')
    .map((j) => ({ ...withCommission(j), timer: 'Live' }));
  const pastJobs = jobsLive
    .filter((j) => j.status === 'completed' || j.endState === 'both_ended')
    .map(withCommission);

  const toggleStatus = (newStatus) => {
    setUserStatusLocal(newStatus);
    if (liveMode) setUserStatus(newStatus);
  };

  const handleEndJob = async (jobId) => {
    if (endJobResult === 'success' || endJobResult === 'waiting') return;
    await endJob(jobId, 'handyman');
    setEndJobResult('waiting');
    setTimeout(() => setEndJobResult('success'), 2500);
    setTimeout(() => setEndJobResult(null), 5000);
  };

  const handleAccept = async (job) => {
    setAcceptingId(job.id);
    try {
      await acceptJob(job);
      setSelectedJob(null);
      setShowNegotiation(false);
      setShowAcceptSuccess(true);
      setTimeout(() => setShowAcceptSuccess(false), 3500);
    } finally {
      setAcceptingId(null);
    }
  };

  const openNegotiation = (job) => {
    setSelectedJob(job.id);
    setShowNegotiation(true);
    setChatMessages([
      { sender: 'client', text: `Hello, I need help with: ${job.service}`, time: '10:30 AM' },
      { sender: 'client', text: 'Can you do this job?', time: '10:31 AM' },
    ]);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'handyman', text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'} />
    ));

  const renderHomeTab = () => (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-2 bg-navy-800 border border-white/10 rounded-full px-4 py-2 cursor-pointer" onClick={() => toggleStatus(userStatus === 'online' ? 'working' : 'online')}>
          <Circle size={10} className={userStatus === 'online' ? 'text-[#10B981] fill-[#10B981]' : 'text-[#EF4444] fill-[#EF4444]'} />
          <span className="text-sm font-medium text-muted">{userStatus === 'online' ? 'Available' : 'Working'}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-navy-700 to-navy border border-white/10 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm opacity-80">Wallet Balance</p>
          <CheckCircle size={20} className="text-[#10B981]" />
        </div>
        <h2 className="text-3xl font-bold mb-1">{formatNaira(45200)}</h2>
        <p className="text-xs opacity-60 mb-4">Available for withdrawal</p>
        <button onClick={() => navigate('/handyman/withdraw')} className="w-full md:w-auto py-3 px-8 bg-accent text-white rounded-2xl font-semibold text-sm hover:bg-accent-dark transition-all shadow-lg">
          <div className="flex items-center justify-center gap-2"><Wallet size={16} /> Withdraw Funds</div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-navy-800 rounded-xl p-5 border border-white/10">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3"><Briefcase size={20} className="text-accent" /></div>
          <p className="text-2xl font-bold text-white">{activeJobs.length}</p>
          <p className="text-sm text-muted">Active Jobs</p>
        </div>
        <div className="bg-navy-800 rounded-xl p-5 border border-white/10">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 flex items-center justify-center mb-3"><TrendingUp size={20} className="text-[#10B981]" /></div>
          <p className="text-2xl font-bold text-white">4.8</p>
          <p className="text-sm text-muted">Performance Rating</p>
        </div>
        <div className="bg-navy-800 rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-1 mb-1">{renderStars(5)}<span className="text-xs text-muted ml-1">(24 reviews)</span></div>
          <p className="text-sm text-muted mt-2"><Shield size={14} className="inline text-[#10B981] mr-1" />Verified Handyman</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-white text-lg mb-3 flex items-center gap-2"><Bell size={18} />Recent Notifications</h3>
        <div className="space-y-2">
          {notifications.length === 0 && (
            <EmptyState icon={Bell} title="No notifications yet" message="Job offers, price agreements and ratings will appear here in real time." />
          )}
          {notifications.map((notif) => (
            <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${notif.read ? 'bg-navy-800 border-white/10' : 'bg-accent/10 border-accent/25'}`}>
              <Bell size={18} className={`mt-0.5 ${notif.read ? 'text-muted/60' : 'text-accent'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notif.read ? 'text-muted' : 'text-white font-medium'}`}>{notif.message}</p>
                <p className="text-xs text-muted mt-1">{timeAgo(notif.createdAt)}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAvailableJobs = () => (
    <div className="space-y-3">
      {available.map((job) => (
        <div key={job.id} className="bg-navy-800 rounded-xl border border-white/10 shadow-sm overflow-hidden">
          <div className="p-4 cursor-pointer" onClick={() => selectedJob === job.id ? setSelectedJob(null) : openNegotiation(job)}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-white">{job.title}</h4>
                <div className="flex items-center gap-1 mt-1"><Zap size={14} className="text-accent" /><span className="text-xs text-muted">{job.serviceType}</span></div>
              </div>
              {selectedJob === job.id ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted mb-3"><MapPin size={12} />{job.location}</div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-white">{formatNaira(job.offeredPrice)}</p>
                <p className="text-[10px] text-[#10B981] font-medium mt-0.5">After 2% commission: {formatNaira(job.earningsAfterCommission)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Earnings</p>
                <p className="text-sm font-bold text-[#10B981]">{formatNaira(job.earningsAfterCommission)}</p>
              </div>
            </div>
          </div>
          {selectedJob === job.id && showNegotiation && (
            <div className="border-t border-white/10">
              <div className="p-4 bg-navy/50">
                <div className="h-48 overflow-y-auto space-y-3 mb-3">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'handyman' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.sender === 'handyman' ? 'bg-accent text-white' : 'bg-navy-700 border border-white/10 text-white'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender === 'handyman' ? 'text-white/70' : 'text-muted'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 bg-navy-700 text-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
                  <button onClick={sendMessage} className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-dark"><Send size={16} /></button>
                </div>
              </div>
              <div className="p-3 border-t border-white/10 bg-navy-800">
                <button
                  onClick={() => handleAccept(job)}
                  disabled={acceptingId === job.id}
                  className="w-full py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {acceptingId === job.id ? <><Loader2 size={15} className="animate-spin" /> Accepting...</> : <>Accept Job - {formatNaira(job.offeredPrice)}</>}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {available.length === 0 && (
        <EmptyState icon={Wrench} title="No available jobs" message="New job requests will appear here live as customers book services." />
      )}
    </div>
  );

  const renderActiveJobs = () => (
    <div className="space-y-3">
      {activeJobs.map((job) => (
        <ActiveJobCard
          key={job.id}
          job={job}
          onOpen={() => navigate(`/handyman/active-job/${job.id}`)}
          onEnd={() => handleEndJob(job.id)}
        />
      ))}
      {activeJobs.length === 0 && (
        <EmptyState icon={Clock} title="No active jobs" message="Jobs you're working on will show up here with live updates." />
      )}
      {endJobResult && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm p-4 rounded-xl shadow-lg z-50 ${endJobResult === 'success' ? 'bg-[#10B981] text-white' : 'bg-amber-500 text-white'}`}>
          <div className="flex items-center gap-2">
            {endJobResult === 'success' ? <><ThumbsUp size={18} /><p className="text-sm font-medium">End request sent — waiting for the other party to confirm.</p></> : <><AlertTriangle size={18} /><p className="text-sm font-medium">Sending end request...</p></>}
          </div>
        </div>
      )}
    </div>
  );

  const renderPastJobs = () => (
    <div className="space-y-3">
      {pastJobs.map((job) => (
        <div key={job.id} className="bg-navy-800 rounded-xl border border-white/10 shadow-sm p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-white">{job.title}</h4>
              <div className="flex items-center gap-1 mt-1"><User size={12} className="text-muted" /><span className="text-xs text-muted">{job.clientName}</span></div>
            </div>
            <div className="flex items-center gap-1">{renderStars(5)}</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted mb-2"><Calendar size={12} />Completed</div>
          <div className="flex items-center justify-between py-2 border-t border-white/10">
            <div>
              <p className="text-xs text-muted">Earnings</p>
              <p className="font-bold text-[#10B981]">{formatNaira(job.earningsAfterCommission)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Commission</p>
              <p className="text-sm text-muted">-{formatNaira(job.commissionFee)}</p>
            </div>
          </div>
        </div>
      ))}
      {pastJobs.length === 0 && (
        <EmptyState icon={History} title="No past jobs yet" message="Completed jobs and your earnings history will appear here." />
      )}
    </div>
  );

  const renderJobsTab = () => (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-white mb-4">Jobs</h1>
      <div className="grid grid-cols-3 sm:flex gap-1 mb-4 bg-navy-800 rounded-xl p-1 w-full sm:w-fit">
        {(['available', 'active', 'past']).map((sub) => (
          <button key={sub} onClick={() => { setJobsSubTab(sub); setSelectedJob(null); setShowNegotiation(false); }} className={`px-2 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize truncate ${jobsSubTab === sub ? 'bg-white text-navy shadow-sm' : 'text-muted hover:text-white'}`}>
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
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <div className="bg-navy-800 rounded-xl p-6 border border-white/10 shadow-sm text-center">
        <div className="w-20 h-20 mx-auto mb-3">
          <Avatar name={currentUser?.fullName || 'KwikFixer'} size={80} />
        </div>
        <h3 className="text-lg font-bold text-white">{currentUser?.fullName || 'Handyman'}</h3>
        <p className="text-sm text-muted">Handyman</p>
        <div className="flex items-center justify-center gap-1 mt-2">{renderStars(5)}<span className="text-xs text-muted ml-1">4.8</span></div>
      </div>

      <div className="bg-navy-800 rounded-xl border border-white/10 shadow-sm overflow-hidden">
        <button onClick={() => navigate('/handyman/portfolio')} className="w-full flex items-center gap-3 p-4 border-b border-white/10 hover:bg-white/5 text-left">
          <Plus size={20} className="text-muted" />
          <div><p className="text-sm font-medium text-white">My Portfolio</p><p className="text-xs text-muted">View and manage work images</p></div>
        </button>
        <button onClick={() => navigate('/handyman/withdraw')} className="w-full flex items-center gap-3 p-4 border-b border-white/10 hover:bg-white/5 text-left">
          <Wallet size={20} className="text-muted" />
          <div><p className="text-sm font-medium text-white">Withdraw Funds</p><p className="text-xs text-muted">Withdraw your earnings</p></div>
        </button>
        <button onClick={() => navigate('/handyman/settings')} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 text-left">
          <Settings size={20} className="text-muted" />
          <div><p className="text-sm font-medium text-white">Settings</p><p className="text-xs text-muted">Account and app settings</p></div>
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-3 sm:flex gap-1 mb-6 bg-navy-800 rounded-xl p-1 w-full sm:w-fit">
        {(['home', 'jobs', 'profile']).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 sm:px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all truncate ${activeTab === tab ? 'bg-white text-navy shadow-sm' : 'text-muted hover:text-white'}`}>
            {tab === 'home' ? 'Home' : tab === 'jobs' ? 'Jobs' : 'Profile'}
          </button>
        ))}
      </div>

      {activeTab === 'home' && renderHomeTab()}
      {activeTab === 'jobs' && renderJobsTab()}
      {activeTab === 'profile' && renderProfileTab()}

      {showAcceptSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm p-4 rounded-xl shadow-lg z-50 bg-[#10B981] text-white">
          <div className="flex items-center gap-2">
            <ThumbsUp size={18} />
            <p className="text-sm font-medium">Job accepted! The customer has been notified.</p>
          </div>
        </div>
      )}

      {showDIYModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-4"><Award size={32} className="text-amber-400" /></div>
            <h3 className="text-lg font-bold text-white mb-2">Premium Feature</h3>
            <p className="text-sm text-muted mb-6">DIY Professional is a premium feature. Upgrade your account to access exclusive tools and higher-paying jobs.</p>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4">
              <p className="text-sm font-semibold text-amber-300">Paywall: ₦5,000/month</p>
              <p className="text-xs text-amber-200/80 mt-1">Unlock premium features and get priority job listings</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDIYModal(false)} className="flex-1 py-2.5 border border-white/15 rounded-xl text-sm font-semibold text-muted hover:bg-white/5">Cancel</button>
              <button className="flex-1 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-dark">Upgrade Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandymanDashboard;