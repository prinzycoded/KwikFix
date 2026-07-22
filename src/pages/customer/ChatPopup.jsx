import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mic, Phone, MoreVertical } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const initialMessages = [
  { text: "Hello, I'm at your location now", sent: true },
  { text: "Great, I'll be there in 10 mins", sent: false },
  { text: "Please bring your tools", sent: true },
];

export default function ChatPopup() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { text: inputText, sent: true }]);
    setInputText('');
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-8rem)] max-w-3xl ${darkMode ? 'dark' : ''}`}>
      <div className="bg-[#003366] text-white px-4 py-3 rounded-t-2xl flex items-center gap-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <div className="flex-1">
          <p className="font-bold">Adebayo Olamide</p>
          <p className="text-xs text-green-300">Online</p>
        </div>
        <Phone className="w-5 h-5" />
        <MoreVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.sent ? 'bg-[#003366] text-white' : 'bg-white dark:bg-gray-800 dark:text-white text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 border-t rounded-b-2xl ${darkMode ? 'border-gray-700 bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-[#003366]"><Mic className="w-6 h-6" /></button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-[#F4F4F4] dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 focus:outline-none"
          />
          <button onClick={sendMessage} className="bg-[#FF6600] text-white rounded-xl p-2 hover:bg-[#e05500]">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
