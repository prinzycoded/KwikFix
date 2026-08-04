export default function ToggleSwitch({ value, onChange, activeColor }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
        value ? activeColor || 'bg-accent' : 'bg-white/20'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
          value ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </div>
  );
}
