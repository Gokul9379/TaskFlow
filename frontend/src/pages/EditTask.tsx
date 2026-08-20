import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('PENDING');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const task = response.data;
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setStatus(task.status || 'PENDING');
        setLocation(task.location);
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''); 
        setCurrentFileUrl(task.fileUrl || '');
      } catch (err) {
        console.error(err);
        toast.error('Failed to load task data.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const loadingToast = toast.loading('Updating task...');
    
    try {
      const token = localStorage.getItem('token');
      await API.patch(
        `/tasks/${id}`,
        { title, description, priority, status, location, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle optional file upload during edit
      if (file) {
        toast.loading('Uploading new attachment...', { id: loadingToast });
        const formData = new FormData();
        formData.append('file', file);
        await API.post(
          `/tasks/${id}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }
      
      toast.success('Task updated successfully! ✨', { id: loadingToast });
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update task.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-emerald-600">
            <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-bold tracking-widest uppercase text-gray-400">Loading details...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] pb-12 font-sans">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 pt-10">
        <div className="relative rounded-[2rem] bg-white p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden">
          
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-600/5 blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Task</h1>
              <p className="mt-1.5 text-sm font-medium text-gray-500">Update the details for this workspace item.</p>
            </div>
            <Link 
              to="/" 
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-50 text-gray-500 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95"
              title="Cancel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Title</label>
              <input 
                type="text" 
                required 
                className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 shadow-inner shadow-gray-100/50" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Description</label>
              <textarea 
                required 
                rows={3} 
                className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 resize-none shadow-inner shadow-gray-100/50" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Status</label>
                <select 
                  className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none shadow-inner shadow-gray-100/50" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done ✅</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Priority</label>
                <select 
                  className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none shadow-inner shadow-gray-100/50" 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority ⚡</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Due Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-inner shadow-gray-100/50" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Location</label>
                <input 
                  type="text" 
                  required 
                  className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 shadow-inner shadow-gray-100/50" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>

            </div>

            {/* Current Attachment Preview */}
            {currentFileUrl && !file && (
              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Current Attachment</label>
                <div className="flex justify-center bg-gray-900/5 rounded-2xl border border-gray-100 p-3">
                  <img 
                    src={currentFileUrl} 
                    alt="Current attachment" 
                    className="max-h-40 w-auto object-contain rounded-xl" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Update Media (Optional)</label>
              <div className={`relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed ${file ? 'border-emerald-400 bg-emerald-50/30' : 'border-gray-200 bg-gray-50/50'} px-4 py-8 transition-all hover:bg-gray-50 hover:border-emerald-300 group`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <svg className={`w-6 h-6 ${file ? 'text-emerald-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-gray-700">
                    {file ? file.name : (currentFileUrl ? 'Upload a new image to replace current' : 'Click to upload or drag & drop')}
                  </span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/40 hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Applying Changes...
                </span>
              ) : (
                'Update Task'
              )}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}