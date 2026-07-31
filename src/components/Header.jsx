import { ArrowLeft } from 'lucide-react';

export default function Header({ title, onBack, rightElement }) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-1">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        </div>
        {rightElement}
      </div>
    </div>
  );
}
