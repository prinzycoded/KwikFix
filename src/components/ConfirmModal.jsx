import { X } from 'lucide-react';

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  icon,
  variant,
}) {
  if (!show) return null;

  const iconBg = variant === 'danger' ? 'bg-red-500/15' : variant === 'success' ? 'bg-[#10B981]/15' : 'bg-amber-500/15';
  const iconColor = variant === 'danger' ? 'text-[#EF4444]' : variant === 'success' ? 'text-[#10B981]' : 'text-amber-500';
  const confirmBg = variant === 'danger' ? 'bg-[#EF4444] hover:bg-red-600' : variant === 'success' ? 'bg-[#10B981] hover:bg-emerald-600' : 'bg-accent hover:bg-accent-dark';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
        {icon && (
          <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-4`}>
            <div className={iconColor}>{icon}</div>
          </div>
        )}
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        {message && <p className="text-sm text-muted mb-6">{message}</p>}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-white/15 rounded-xl text-sm font-semibold text-muted hover:bg-white/5 transition-colors"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition-all ${confirmBg}`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
