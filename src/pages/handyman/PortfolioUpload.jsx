import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';

const MOCK_PORTFOLIO = [
  { id: '1', url: '', title: 'Kitchen Sink Repair', date: '2026-07-15' },
  { id: '2', url: '', title: 'Electrical Wiring', date: '2026-07-10' },
  { id: '3', url: '', title: 'Wardrobe Assembly', date: '2026-07-05' },
  { id: '4', url: '', title: 'Pipe Replacement', date: '2026-06-28' },
];

const PLACEHOLDER_COLORS = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-amber-100', 'bg-pink-100', 'bg-teal-100'];

function PortfolioUpload() {
  const navigate = useNavigate();
  const [images, setImages] = useState(MOCK_PORTFOLIO);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  const pickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const title = file.name.replace(/\.[^.]+$/, '') || 'Untitled Work';
      setImages((prev) => [...prev, { id: Date.now().toString(), url, title, date: new Date().toISOString().split('T')[0] }]);
    }
    e.target.value = '';
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><ChevronLeft size={24} className="text-[#003366]" /></button>
        <h1 className="text-2xl font-bold text-[#003366] dark:text-white">My Portfolio</h1>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {images.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-[#F4F4F4] dark:bg-gray-700 flex items-center justify-center mx-auto mb-4"><ImageIcon size={36} className="text-gray-300" /></div>
          <h3 className="text-lg font-bold text-gray-400 mb-2">No images yet</h3>
          <p className="text-sm text-gray-400 mb-6">Add your work images to showcase your skills</p>
          <button onClick={pickImage} className="px-6 py-3 bg-[#FF6600] text-white rounded-xl font-semibold hover:bg-orange-600 inline-flex items-center gap-2"><Plus size={18} /> Add Your First Image</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className={`aspect-square ${PLACEHOLDER_COLORS[idx % PLACEHOLDER_COLORS.length]} flex items-center justify-center`}>
                  {img.url ? (
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={40} className="text-white/60" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <button onClick={() => setShowDeleteConfirm(img.id)} className="opacity-0 group-hover:opacity-100 transition-all p-3 bg-[#EF4444] text-white rounded-full hover:bg-red-600"><Trash2 size={20} /></button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{img.title}</p>
                  <p className="text-xs text-gray-400">{img.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={pickImage} className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF6600] text-white rounded-full shadow-xl hover:bg-orange-600 flex items-center justify-center z-30"><Plus size={28} /></button>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-[#EF4444]" /></div>
            <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-2">Delete Image?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">Cancel</button>
              <button onClick={() => removeImage(showDeleteConfirm)} className="flex-1 py-2.5 bg-[#EF4444] text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioUpload;
