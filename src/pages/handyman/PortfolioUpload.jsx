import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';

const MOCK_PORTFOLIO = [
  { id: '1', url: '', title: 'Kitchen Sink Repair', description: 'Replaced a corroded sink tap and fixed the leaking pipes underneath.', date: '2026-07-15' },
  { id: '2', url: '', title: 'Electrical Wiring', description: 'Full rewiring of a 3-bedroom apartment with new sockets and breakers.', date: '2026-07-10' },
  { id: '3', url: '', title: 'Wardrobe Assembly', description: 'Assembled and wall-mounted a 3-door sliding wardrobe.', date: '2026-07-05' },
  { id: '4', url: '', title: 'Pipe Replacement', description: 'Swapped out a burst water pipe and restored full water flow.', date: '2026-06-28' },
];

const PLACEHOLDER_COLORS = ['bg-accent/15', 'bg-[#10B981]/15', 'bg-purple-500/15', 'bg-amber-500/15', 'bg-pink-500/15', 'bg-teal-500/15'];

function PortfolioUpload() {
  const navigate = useNavigate();
  const [images, setImages] = useState(MOCK_PORTFOLIO);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingTitle, setPendingTitle] = useState('');
  const [pendingDescription, setPendingDescription] = useState('');
  const fileInputRef = useRef(null);

  const pickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPendingImage(url);
      setPendingTitle(file.name.replace(/\.[^.]+$/, '') || 'Untitled Work');
      setPendingDescription('');
    }
    e.target.value = '';
  };

  const closePendingModal = () => {
    setPendingImage(null);
    setPendingTitle('');
    setPendingDescription('');
  };

  const savePendingImage = () => {
    if (!pendingImage) return;
    const title = pendingTitle.trim() || 'Untitled Work';
    setImages((prev) => [...prev, { id: Date.now().toString(), url: pendingImage, title, description: pendingDescription.trim(), date: new Date().toISOString().split('T')[0] }]);
    closePendingModal();
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg"><ChevronLeft size={24} className="text-white" /></button>
        <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
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
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4"><ImageIcon size={36} className="text-muted" /></div>
          <h3 className="text-lg font-bold text-muted mb-2">No images yet</h3>
          <p className="text-sm text-muted mb-6">Add your work images to showcase your skills</p>
          <button onClick={pickImage} className="px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark inline-flex items-center gap-2"><Plus size={18} /> Add Your First Image</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-navy-800 shadow-sm">
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
                  <p className="text-sm font-medium text-white truncate">{img.title}</p>
                  {img.description && <p className="text-xs text-muted mt-1 line-clamp-2">{img.description}</p>}
                  <p className="text-xs text-muted mt-1">{img.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={pickImage} className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-white rounded-full shadow-xl hover:bg-accent-dark flex items-center justify-center z-30"><Plus size={28} /></button>
        </>
      )}

      {pendingImage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closePendingModal}>
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add Portfolio Work</h3>
              <button onClick={closePendingModal} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={18} className="text-muted" /></button>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden bg-navy-700 border border-white/10 mb-4 flex items-center justify-center">
              <img src={pendingImage} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-white mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Kitchen Sink Repair"
                  value={pendingTitle ?? ''}
                  onChange={(e) => setPendingTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/15 bg-navy-700 text-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the work you did (e.g. materials used, problem solved)..."
                  value={pendingDescription ?? ''}
                  onChange={(e) => setPendingDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/15 bg-navy-700 text-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none"
                />
                <p className="text-xs text-muted mt-1">A short description helps customers understand your work.</p>
              </div>
            </div>

            <button onClick={savePendingImage} className="mt-5 w-full py-3.5 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark">
              Add to Portfolio
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-[#F87171]" /></div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Image?</h3>
            <p className="text-sm text-muted mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/15 rounded-xl text-sm font-semibold text-muted hover:bg-white/5">Cancel</button>
              <button onClick={() => removeImage(showDeleteConfirm)} className="flex-1 py-2.5 bg-[#EF4444] text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioUpload;
