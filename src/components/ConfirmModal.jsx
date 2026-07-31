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

  const iconBg = variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : variant === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30';
  const iconColor = variant === 'danger' ? 'text-[#EF4444]' : variant === 'success' ? 'text-[#10B981]' : 'text-amber-500';
  const confirmBg = variant === 'danger' ? 'bg-[#EF4444] hover:bg-red-600' : variant === 'success' ? 'bg-[#10B981] hover:bg-emerald-600' : 'bg-[#FF6600] hover:bg-orange-600';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm text-center">
        {icon && (
          <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-4`}>
            <div className={iconColor}>{icon}</div>
          </div>
        )}
        <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-2">{title}</h3>
        {message && <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
