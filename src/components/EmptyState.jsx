export default function EmptyState({ icon: Icon, title, message, action, actionLabel }) {
  return (
    <div className="bg-navy-800 border border-dashed border-white/15 rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon size={24} className="text-muted" />}
      </div>
      <p className="font-bold text-white mb-1">{title}</p>
      <p className="text-sm text-muted max-w-xs mx-auto">{message}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="mt-5 inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-all active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
