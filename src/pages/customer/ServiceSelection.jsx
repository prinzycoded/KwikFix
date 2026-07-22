import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Zap, Settings, Hammer, AlertTriangle } from 'lucide-react';

const services = [
  { name: 'Plumbing', icon: Wrench, key: 'plumbing' },
  { name: 'Electrical', icon: Zap, key: 'electrical' },
  { name: 'Generator Repair', icon: Settings, key: 'generator_repair' },
  { name: 'Carpentry', icon: Hammer, key: 'carpentry' },
];

export default function ServiceSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F4F9] dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="w-6 h-6 text-[#003366] dark:text-white" />
          </button>
          <h1 className="text-2xl font-bold text-[#003366] dark:text-white ml-2">
            What service do you need?
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => navigate(`/booking-form?service=${service.key}`)}
              className="bg-[#003366] rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-[#004488] transition-colors aspect-square"
            >
              <service.icon className="w-12 h-12 text-[#FF6600]" />
              <span className="text-white font-medium text-center text-lg">{service.name}</span>
            </button>
          ))}
        </div>

        <div className="max-w-md">
          <h2 className="text-xl font-semibold text-[#003366] dark:text-white mb-3">Need urgent help?</h2>
          <button
            onClick={() => navigate('/diy-sos')}
            className="w-full bg-[#FF6600] text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e05500] transition-colors"
          >
            <AlertTriangle className="w-6 h-6" />
            DIY SOS Emergency
          </button>
        </div>
      </div>
    </div>
  );
}
