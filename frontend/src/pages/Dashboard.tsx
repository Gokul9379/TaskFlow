import toast from 'react-hot-toast';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; // <-- Updated to use central API instance
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import { AuthContext } from '../context/AuthContext';

// --- Type Definitions ---
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  location: string;
  fileUrl?: string;
  weather?: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  // Derive username from the Context (Real Name)
  const displayName = auth?.userName || 'User';

  // Filter and Pagination State
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      try {
        const response = await API.get('/tasks', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            limit,
            ...(statusFilter && { status: statusFilter }),
            ...(priorityFilter && { priority: priorityFilter }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(searchQuery && { search: searchQuery }),
          },
        });
        
        const extractedTasks = response.data.data || response.data.tasks || response.data;
        if (Array.isArray(extractedTasks)) {
          setTasks(extractedTasks);
          if (response.data.meta) {
            setTotalPages(response.data.meta.lastPage || 1);
          }
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page, statusFilter, priorityFilter, startDate, endDate, searchQuery]);

  // --- Custom Delete Logic ---
  const confirmDelete = async (taskId: string) => {
    const loadingToast = toast.loading('Deleting task...');
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to delete task.', { id: loadingToast });
    }
  };

  const handleDelete = (taskId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Premium, high-contrast dark toast design
    toast((t) => (
      <div className="flex flex-col gap-1.5 min-w-[260px]">
        
        {/* Title with Warning Icon */}
        <div className="flex items-center gap-2.5 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-wide">Delete Task?</span>
        </div>

        {/* Subtitle */}
        <span className="text-sm text-gray-400 pl-[42px]">
          This action cannot be undone.
        </span>

        {/* Action Buttons */}
        <div className="mt-3 flex gap-2 pl-[42px]">
          <button 
            onClick={() => { toast.dismiss(t.id); confirmDelete(taskId); }} 
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-rose-900/50 transition-all hover:bg-rose-500 active:scale-95"
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="flex-1 rounded-xl bg-gray-700 px-4 py-2.5 text-xs font-bold text-gray-200 shadow-sm transition-all hover:bg-gray-600 hover:text-white active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity, 
      style: { 
        background: '#18181B',
        border: '1px solid #27272A', 
        padding: '16px 20px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      } 
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await API.patch(`/tasks/${taskId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
      
      toast.success('Status updated!');
    } catch (error) {
      toast.error('Failed to update task status.');
    }
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setPage(1);
  };

  const completedCount = tasks.filter(t => t.status === 'DONE').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      
      <Navbar 
        searchTerm={searchQuery} 
        onSearch={(term) => { setSearchQuery(term); setPage(1); }} 
      />

      <main className="mx-auto max-w-6xl px-6 pt-10">
        
        {/* Header & Quick Stats */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{displayName}</span> 👋
            </h1>
            <p className="mt-1.5 text-sm font-medium text-gray-500">Here is what's happening with your projects today.</p>
          </div>
          
          {/* Dashboard Metric Pills */}
          {!loading && tasks.length > 0 && (
            <div className="flex gap-3">
              <div className="flex flex-col rounded-2xl bg-white px-5 py-3 shadow-sm border border-gray-100">
                <span className="text-xs font-bold uppercase text-gray-400">Total</span>
                <span className="text-xl font-black text-gray-800">{tasks.length}</span>
              </div>
              <div className="flex flex-col rounded-2xl bg-white px-5 py-3 shadow-sm border border-gray-100">
                <span className="text-xs font-bold uppercase text-gray-400">Active</span>
                <span className="text-xl font-black text-blue-600">{inProgressCount}</span>
              </div>
              <div className="flex flex-col rounded-2xl bg-white px-5 py-3 shadow-sm border border-gray-100">
                <span className="text-xs font-bold uppercase text-gray-400">Done</span>
                <span className="text-xl font-black text-emerald-600">{completedCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* --- CONTROL BAR --- */}
        <div className="mb-8 rounded-3xl bg-white p-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100">
          <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:items-end md:gap-3">
            
            <div className="col-span-1 md:flex-1 md:min-w-[140px]">
              <label className="mb-1.5 ml-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</label>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="w-full rounded-2xl border-none bg-gray-50/80 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none">
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            
            <div className="col-span-1 md:flex-1 md:min-w-[140px]">
              <label className="mb-1.5 ml-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Priority</label>
              <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }} className="w-full rounded-2xl border-none bg-gray-50/80 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none">
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            
            <div className="col-span-1 md:flex-1 md:min-w-[140px]">
              <label className="mb-1.5 ml-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">From Date</label>
              <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="w-full rounded-2xl border-none bg-gray-50/80 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-h-[44px]" />
            </div>
            
            <div className="col-span-1 md:flex-1 md:min-w-[140px]">
              <label className="mb-1.5 ml-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">To Date</label>
              <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="w-full rounded-2xl border-none bg-gray-50/80 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-h-[44px]" />
            </div>
            
            <button onClick={clearFilters} className="col-span-2 mt-2 w-full md:mt-0 md:w-auto md:flex-none rounded-2xl bg-gray-50 px-6 py-3 text-sm font-bold text-gray-600 shadow-sm border border-gray-200 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95 whitespace-nowrap min-h-[44px]">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Task Grid & States */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <svg className="h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-bold tracking-wide text-gray-400 uppercase">Loading Workspace...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] bg-white py-24 shadow-sm border border-gray-100 text-center px-4">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-black text-gray-900">No tasks found</h3>
            <p className="mt-2 mb-8 max-w-sm text-sm text-gray-500">
              You either haven't created any tasks yet, or nothing matches your current filters.
            </p>
            <Link 
              to="/create-task" 
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 active:scale-95"
            >
              + Create New Task
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onSelect={() => setSelectedTask(task)}
                  onStatusChange={handleStatusChange}
                  onDelete={(e: React.MouseEvent<HTMLButtonElement>) => handleDelete(task._id, e)}
                  onEdit={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); navigate(`/edit-task/${task._id}`); }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-6">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)} 
                  className="flex items-center justify-center h-10 w-24 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95"
                >
                  Previous
                </button>
                <span className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600">
                  {page} / {totalPages}
                </span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(page + 1)} 
                  className="flex items-center justify-center h-10 w-24 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Global Popup Modal */}
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      </main>
    </div>
  );
}