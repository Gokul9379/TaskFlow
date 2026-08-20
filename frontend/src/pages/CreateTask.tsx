import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Creating your task...');
    
    const token = localStorage.getItem('token');

    try {
      const taskResponse = await axios.post(
        'http://localhost:3000/tasks',
        { title, description, priority, location, dueDate, status: 'PENDING' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTaskId = taskResponse.data._id || taskResponse.data.data?._id;

      if (file && newTaskId) {
        toast.loading('Uploading attachment...', { id: loadingToast });
        const formData = new FormData();
        formData.append('file', file);

        await axios.post(
          `http://localhost:3000/tasks/${newTaskId}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      toast.success('Task created successfully! 🎉', { id: loadingToast });
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create task. Please check your inputs.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] pb-12 font-sans">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 pt-10">
        <div className="relative rounded-[2rem] bg-white p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden">
          
          {/* Decorative Background Blur */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-600/5 blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Task</h1>
              <p className="mt-1.5 text-sm font-medium text-gray-500">Add a new item to your workspace.</p>
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
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">
                <span>Title</span>
              </label>
              <input 
                type="text" 
                required 
                placeholder="What needs to be done?"
                className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 shadow-inner shadow-gray-100/50" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">
                <span>Description</span>
              </label>
              <textarea 
                required 
                rows={3} 
                placeholder="Add some details about this task..."
                className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 resize-none shadow-inner shadow-gray-100/50" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            {/* Grid for Priority, Date, Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">
                  <span>Priority</span>
                </label>
                <select 
                  className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none shadow-inner shadow-gray-100/50" 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority ⚡</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">
                  <span>Due Date</span>
                </label>
                <input 
                  type="date" 
                  required 
                  className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-inner shadow-gray-100/50" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">
                  <span>Location (City)</span>
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., London, UK" 
                  className="w-full rounded-2xl border-none bg-gray-50/80 px-5 py-3.5 text-sm font-medium text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 shadow-inner shadow-gray-100/50" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>

            </div>

            {/* Premium File Upload Area */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Attach Media (Optional)</label>
              <div className={`relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed ${file ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200 bg-gray-50/50'} px-4 py-8 transition-all hover:bg-gray-50 hover:border-blue-300 group`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <svg className={`w-6 h-6 ${file ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-gray-700">{file ? file.name : 'Click to upload or drag & drop'}</span>
                  <span className="block mt-1 text-xs font-medium text-gray-400">Supported: JPG, PNG, GIF (Max 5MB)</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/40 hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Workspace...
                </span>
              ) : (
                'Create Task'
              )}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}