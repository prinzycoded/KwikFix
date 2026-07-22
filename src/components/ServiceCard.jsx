export default function ServiceCard({ service, onClick }) {
  const Icon = service.icon;
  return (
    <button
      onClick={onClick}
      className="bg-[#003366] rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-[#004488] transition-colors"
    >
      <Icon className="w-10 h-10 text-[#FF6600]" />
      <span className="text-white font-medium text-center">{service.name}</span>
    </button>
  );
}
