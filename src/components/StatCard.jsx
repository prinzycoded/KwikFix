export default function StatCard({ icon: Icon, value, label, iconBg = 'bg-accent/10', iconColor = 'text-accent', valueClass = 'text-white' }) {
  return (
    <div className="bg-navy-800 border border-white/10 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
        {Icon && <Icon size={20} className={iconColor} />}
      </div>
      <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}
