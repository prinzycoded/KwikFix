import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, FileText, Eye, Share2, Lock, CalendarClock } from 'lucide-react';

const SECTIONS = [
  {
    icon: <ShieldCheck size={18} className="text-accent" />,
    title: 'Account Security',
    points: [
      'Verify your email address to activate job acceptance and receive security alerts.',
      'KwikFix will never ask for your password. Keep it private at all times.',
      'Use strong, unique passwords and avoid shared devices when signed in.',
      'Sign out of your account on any shared device after each session.',
    ],
  },
  {
    icon: <FileText size={18} className="text-accent" />,
    title: 'Data We Collect',
    points: [
      'Profile information: name, email address, phone number, and location.',
      'Professional data: portfolio, skills, service categories, and ratings.',
      'Job history, payment records, and withdrawal details.',
      'Chat messages exchanged with customers regarding jobs.',
      'Basic device and usage information to improve the app experience.',
    ],
  },
  {
    icon: <Eye size={18} className="text-accent" />,
    title: 'How We Use Your Data',
    points: [
      'Match you with customers requesting services you offer near you.',
      'Process payouts to your bank account securely.',
      'Verify identity, prevent fraud, and keep the platform safe.',
      'Send job alerts and notifications that you opt into.',
      'Improve our matching, recommendations, and platform features.',
    ],
  },
  {
    icon: <Share2 size={18} className="text-accent" />,
    title: 'Data Sharing',
    points: [
      'We never sell your personal data to third parties.',
      'Customers see only what is needed for a job: your name, portfolio, rating, and availability.',
      'Payment and banking partners receive minimal details required to process your withdrawals.',
      'Personal data is only shared with authorities where legally required.',
    ],
  },
  {
    icon: <Lock size={18} className="text-accent" />,
    title: 'Security Measures',
    points: [
      'All traffic is protected with encrypted connections (HTTPS).',
      'Credentials are securely stored using Firebase Authentication.',
      'Access to your data is limited to what your role requires.',
      'Our database is protected by strict security rules and reviewed regularly.',
    ],
  },
];

function PrivacySecurity() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft size={24} className="text-white" /></button>
        <h1 className="text-2xl font-bold text-white">Privacy & Security</h1>
      </div>

      <div className="bg-gradient-to-r from-navy-800 to-navy rounded-2xl p-6 mb-6 border border-white/10">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4"><ShieldCheck size={24} className="text-accent" /></div>
        <h2 className="text-lg font-bold text-white mb-2">Your data is protected</h2>
        <p className="text-sm text-muted leading-relaxed">We take the privacy and security of your information seriously. This page explains what data we collect, how it is used, and the safeguards we put in place to keep your account safe.</p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="bg-navy-800 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">{section.icon}</div>
              <h2 className="text-sm font-semibold text-white">{section.title}</h2>
            </div>
            <div className="border-t border-white/10 px-4 py-4 space-y-3">
              {section.points.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p className="text-sm text-muted leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <CalendarClock size={18} className="text-faint shrink-0" />
        <p className="text-xs text-faint">This policy is reviewed regularly. Updates will be communicated through the app and your registered email address.</p>
      </div>
    </div>
  );
}

export default PrivacySecurity;