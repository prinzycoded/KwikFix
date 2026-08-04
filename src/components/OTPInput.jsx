import { useRef } from 'react';

export default function OTPInput({ otp, onChange, onKeyDown, onPaste, verified, error }) {
  const otpRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    onChange(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (onKeyDown) onKeyDown(index, e);
  };

  const handlePaste = (e) => {
    if (onPaste) {
      onPaste(e);
      return;
    }
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pasted.length === 0) return;
    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < Math.min(pasted.length, 6); i++) {
      newOtp[i] = pasted[i];
    }
    onChange(newOtp);
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-4" onPaste={handlePaste}>
      {otp.map((digit, idx) => (
        <div key={idx} className="flex-1 min-w-0 max-w-11 sm:max-w-12">
          <input
            ref={(el) => { otpRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`h-12 sm:h-14 w-full text-center text-xl font-bold rounded-xl border-2 bg-navy-700 text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all
              ${verified ? 'border-[#10B981] bg-[#10B981]/10' : 'border-white/15'}
              ${error && !verified ? 'border-[#EF4444]' : ''}`}
            disabled={verified}
          />
        </div>
      ))}
    </div>
  );
}
