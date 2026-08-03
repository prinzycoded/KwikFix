import { ArrowLeft } from 'lucide-react';

export default function Header({ title, onBack, rightElement }) {
  return (
    <div className="sticky top-0 z-10 bg-navy-800 border-b border-white/10">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-1">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
        {rightElement}
      </div>
    </div>
  );
}
