import { avatarGradient, getInitials } from '../lib/format';

export default function Avatar({ name = '', size = 40, className = '' }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none ${className}`}
      style={{ width: size, height: size, background: avatarGradient(name), fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
