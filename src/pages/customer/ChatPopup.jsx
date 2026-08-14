import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Mic, Phone, MoreVertical, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

const mockMessages = [
  { id: 'm1', text: "Hello, I'm at your location now", senderId: 'other', createdAt: new Date().toISOString() },
  { id: 'm2', text: "Great, I'll be there in 10 mins", senderId: 'me', createdAt: new Date().toISOString() },
  { id: 'm3', text: 'Please bring your tools', senderId: 'other', createdAt: new Date().toISOString() },
];

export default function ChatPopup() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bookings, jobs, chatMessages, chatConvoId, setChatConvoId, sendMessage, presenceStatuses } = useApp();
  const { currentUser, userRole, isEmailVerified } = useAuth();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const record = bookings.find((b) => b.id === id) || jobs.find((j) => j.id === id);
  const customerUid = record?.customerUid || currentUser?.id;
  const handymanUid = record?.handymanId;
  const convoId = customerUid && handymanUid ? `${customerUid}_${handymanUid}` : null;

  const isHandyman = userRole === 'handyman';
  const otherName = isHandyman
    ? record?.customerName || currentUser?.fullName || 'Customer'
    : record?.handymanName || 'KWIKFIXER';
  const otherUid = isHandyman ? customerUid : handymanUid;
  const otherOnline = otherUid && presenceStatuses[otherUid]?.status === 'online';

  useEffect(() => {
    setChatConvoId(convoId);
    return () => setChatConvoId(null);
  }, [convoId, setChatConvoId]);

  const messages = convoId ? [...chatMessages].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt))) : mockMessages;

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(convoId, inputText);
      setInputText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl">
      <div className="bg-navy-700 text-white px-4 py-3 rounded-t-2xl flex items-center gap-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <div className="flex-1">
          <p className="font-bold">{otherName}</p>
          <p className={`text-xs ${convoId ? (otherOnline ? 'text-[#10B981]' : 'text-muted') : 'text-muted'}`}>
            {convoId ? (otherOnline ? 'Online' : 'Offline') : 'Chat opens once a KWIKFIXER accepts the job'}
          </p>
        </div>
        <Phone className="w-5 h-5" />
        <MoreVertical className="w-5 h-5" />
      </div>

      {!convoId && (
        <div className="px-4 py-2 bg-accent/10 border-b border-accent/25 text-xs text-accent flex items-center gap-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Waiting for a handyman to accept your booking — messages will sync automatically.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-navy">
        {messages.map((msg) => {
          const mine = convoId ? msg.senderId === currentUser?.id : msg.senderId === 'me';
          return (
            <div key={msg.id || msg.text} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${mine ? 'bg-accent text-white' : 'bg-navy-800 border border-white/10 text-white'}`}>
                <p className="text-sm">{msg.text}</p>
                {msg.createdAt && (
                  <p className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-muted'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 rounded-b-2xl bg-navy-800">
        <div className="flex items-center gap-2">
          <button className="text-muted hover:text-accent"><Mic className="w-6 h-6" /></button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={convoId ? 'Type a message...' : 'Chat unavailable until job is accepted'}
            disabled={!convoId}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-navy-700 text-white placeholder:text-muted/60 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          />
          <button onClick={handleSend} disabled={!convoId} className="bg-accent text-white rounded-xl p-2 hover:bg-accent-dark disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}