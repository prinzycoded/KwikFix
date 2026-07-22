import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, MessageCircle, Send, Mic, PhoneOff, Volume2, VolumeX } from 'lucide-react';

const BUBBLE_COLORS = ['#003366', '#FF6600', '#F4F4F4'];

export default function DIYScreen() {
  const navigate = useNavigate();
  const [view, setView] = useState('menu');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello! I'm a DIY professional. How can I help you with your emergency?",
      sender: 'handyman',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [callState, setCallState] = useState('connecting');
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg = {
      id: crypto.randomUUID(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const reply = {
        id: crypto.randomUUID(),
        text: "I understand this is urgent. Let me guide you through the fix step by step.",
        sender: 'handyman',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const handleStartCall = () => {
    setView('call');
    setCallState('connecting');
    setCallTimer(0);
    setIsMuted(false);
    setIsSpeaker(false);

    setTimeout(() => {
      setCallState('connected');
      const interval = setInterval(() => {
        setCallTimer((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }, 2500);

    setTimeout(() => {
      setShowPremiumPopup(true);
    }, 6000);
  };

  const handleEndCall = () => {
    setCallState('ended');
  };

  const handleWhatsApp = () => {
    window.alert('Opening WhatsApp...');
    setShowPremiumPopup(true);
  };

  const handleVoiceNote = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        const voiceNoteMsg = {
          id: crypto.randomUUID(),
          text: '[Voice note recorded]',
          sender: 'user',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, voiceNoteMsg]);

        setTimeout(() => {
          const reply = {
            id: crypto.randomUUID(),
            text: "I've received your voice note. Let me analyze the issue.",
            sender: 'handyman',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, reply]);
        }, 1500);
      }, 3000);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (view === 'chat') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setView('menu')} style={styles.backButton}>
            <ArrowLeft color="#F4F4F4" size={24} />
          </button>
          <h1 style={styles.title}>DIY Chat</h1>
        </div>
        <div style={styles.chatContainer}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.chatBubble,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? BUBBLE_COLORS[1] : BUBBLE_COLORS[0],
                borderBottomRightRadius: msg.sender === 'user' ? 4 : 12,
                borderBottomLeftRadius: msg.sender === 'user' ? 12 : 4,
              }}
            >
              <span style={{ color: '#F4F4F4', fontSize: 14 }}>{msg.text}</span>
            </div>
          ))}
        </div>
        <div style={styles.inputBar}>
          <input
            style={styles.chatInput}
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleVoiceNote} style={{
            ...styles.iconButton,
            backgroundColor: isRecording ? '#FF4444' : BUBBLE_COLORS[0],
          }}>
            <Mic color="#F4F4F4" size={20} />
          </button>
          <button onClick={handleSendMessage} style={styles.iconButton}>
            <Send color="#F4F4F4" size={20} />
          </button>
        </div>
        {showPremiumPopup && (
          <div style={styles.overlay} onClick={() => setShowPremiumPopup(false)}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: BUBBLE_COLORS[0], marginBottom: 8 }}>Premium DIY Subscriber</h3>
              <p style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>
                This professional is a premium DIY subscriber
              </p>
              <button
                onClick={() => setShowPremiumPopup(false)}
                style={styles.popupButton}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'call') {
    return (
      <div style={styles.container}>
        <div style={styles.callScreen}>
          <div style={styles.callHeader}>
            <h2 style={{ color: '#F4F4F4', fontSize: 18 }}>DIY Professional</h2>
            {callState === 'connecting' && (
              <div style={styles.connectingContainer}>
                <div style={styles.connectingDot} />
                <div style={{ ...styles.connectingDot, animationDelay: '0.3s' }} />
                <div style={{ ...styles.connectingDot, animationDelay: '0.6s' }} />
                <p style={{ color: '#F4F4F4', marginTop: 12, fontSize: 14 }}>Connecting...</p>
              </div>
            )}
            {callState === 'connected' && (
              <p style={{ color: '#F4F4F4', fontSize: 32, fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>
                {formatTimer(callTimer)}
              </p>
            )}
            {callState === 'ended' && (
              <p style={{ color: '#FF6666', fontSize: 16 }}>Call Ended</p>
            )}
          </div>
          <div style={styles.callControls}>
            <button onClick={() => setIsMuted(!isMuted)} style={styles.callButton}>
              {isMuted ? <VolumeX color="#FF6600" size={28} /> : <Volume2 color="#F4F4F4" size={28} />}
              <span style={{ color: '#F4F4F4', fontSize: 12, marginTop: 4 }}>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button onClick={handleEndCall} style={{ ...styles.callButton, backgroundColor: '#FF4444' }}>
              <PhoneOff color="#F4F4F4" size={28} />
              <span style={{ color: '#F4F4F4', fontSize: 12, marginTop: 4 }}>End Call</span>
            </button>
            <button onClick={() => setIsSpeaker(!isSpeaker)} style={styles.callButton}>
              <Volume2 color={isSpeaker ? '#FF6600' : '#F4F4F4'} size={28} />
              <span style={{ color: '#F4F4F4', fontSize: 12, marginTop: 4 }}>{isSpeaker ? 'Speaker Off' : 'Speaker'}</span>
            </button>
          </div>
        </div>
        {showPremiumPopup && (
          <div style={styles.overlay} onClick={() => setShowPremiumPopup(false)}>
            <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: BUBBLE_COLORS[0], marginBottom: 8 }}>Premium DIY Subscriber</h3>
              <p style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>
                This professional is a premium DIY subscriber
              </p>
              <button
                onClick={() => setShowPremiumPopup(false)}
                style={styles.popupButton}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft color="#F4F4F4" size={24} />
        </button>
        <h1 style={styles.title}>DIY SOS Emergency</h1>
      </div>

      <div style={styles.cardsContainer}>
        <div style={styles.card} onClick={() => setView('chat')}>
          <div style={{ ...styles.cardIcon, backgroundColor: BUBBLE_COLORS[0] }}>
            <MessageSquare color="#F4F4F4" size={32} />
          </div>
          <h3 style={styles.cardTitle}>In-App Text & Voice Notes</h3>
          <p style={styles.cardDesc}>Chat with a DIY professional via text or voice notes</p>
        </div>

        <div style={styles.card} onClick={handleStartCall}>
          <div style={{ ...styles.cardIcon, backgroundColor: BUBBLE_COLORS[1] }}>
            <Phone color="#F4F4F4" size={32} />
          </div>
          <h3 style={styles.cardTitle}>Direct Call</h3>
          <p style={styles.cardDesc}>₦50/min - Speak with a handyman directly</p>
        </div>

        <div style={styles.card} onClick={handleWhatsApp}>
          <div style={{ ...styles.cardIcon, backgroundColor: '#25D366' }}>
            <MessageCircle color="#F4F4F4" size={32} />
          </div>
          <h3 style={styles.cardTitle}>Chat on WhatsApp</h3>
          <p style={styles.cardDesc}>Connect via WhatsApp for quick assistance</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F4F4F4',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#003366',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
  },
  title: {
    color: '#F4F4F4',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 0,
  },
  cardsContainer: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 0,
  },
  cardDesc: {
    color: '#666',
    fontSize: 13,
    margin: 0,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    overflowY: 'auto',
  },
  chatBubble: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: 12,
  },
  inputBar: {
    padding: 12,
    backgroundColor: '#FFF',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderTop: '1px solid #DDD',
  },
  chatInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: 20,
    border: '1px solid #DDD',
    outline: 'none',
    fontSize: 14,
  },
  iconButton: {
    backgroundColor: '#003366',
    border: 'none',
    borderRadius: 24,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  callScreen: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24,
  },
  callHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    paddingTop: 40,
  },
  connectingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'column',
  },
  connectingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6600',
    animation: 'pulse 1s infinite',
  },
  callControls: {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    paddingBottom: 40,
  },
  callButton: {
    backgroundColor: '#003366',
    border: 'none',
    borderRadius: 40,
    width: 72,
    height: 72,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: 300,
    textAlign: 'center',
  },
  popupButton: {
    backgroundColor: '#FF6600',
    color: '#FFF',
    border: 'none',
    borderRadius: 8,
    padding: '10px 32px',
    fontSize: 14,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
