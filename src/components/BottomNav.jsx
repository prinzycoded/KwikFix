export default function BottomNav({ items, activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-navy-800 border-t border-white/10 px-4 py-3 flex justify-around items-center">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onTabChange(item.key)}
          className={`flex flex-col items-center gap-1 ${
            activeTab === item.key ? 'text-accent' : 'text-muted'
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
