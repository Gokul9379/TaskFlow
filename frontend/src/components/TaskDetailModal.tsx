import WeatherBadge from './WeatherBadge';
import { Link } from 'react-router-dom';

interface Task {
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

interface ModalProps {
  task: Task | null;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: ModalProps) {
  if (!task) return null;

  return (
    // Backdrop with click-to-close functionality
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      {/* Modal Container - stopPropagation prevents clicks inside from closing it */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100/50"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95"
          title="Close modal"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header (Title & Badges) */}
        <div className="mb-6 pr-10">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">{task.title}</h2>
          
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <span className={`rounded-full px-3 py-1.5 ${
              task.status === 'DONE' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-500/20' : 
              task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-500/20' : 
              'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-500/20'
            }`}>
              {task.status.replace('_', ' ')}
            </span>
            
            <span className={`flex items-center rounded-full px-3 py-1.5 ${
              task.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-500/20' :
              task.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-500/20' :
              'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-500/20'
            }`}>
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                task.priority === 'HIGH' ? 'bg-rose-500' :
                task.priority === 'MEDIUM' ? 'bg-orange-500' :
                'bg-slate-500'
              }`}></span>
              {task.priority} Priority
            </span>
          </div>
        </div>

        <div className="my-6 space-y-6 border-y border-gray-100 py-6">
          {/* Description */}
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">Description</span>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
              {task.description}
            </p>
          </div>

          {/* Meta Information Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1 rounded-2xl bg-gray-50/50 p-4 border border-gray-100/50">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Location Details</span>
              <div className="flex items-center justify-between mt-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                  📍 {task.location}
                </span>
                <WeatherBadge weather={task.weather} />
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-2xl bg-gray-50/50 p-4 border border-gray-100/50">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Deadline</span>
              <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                📅 {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Image Attachment */}
        {task.fileUrl && (
          <div className="mb-8">
            <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-gray-400">Attachment</span>
            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
              <img 
                src={task.fileUrl} 
                alt="Task attachment" 
                className="h-64 w-full object-cover transition-transform hover:scale-105 duration-700" 
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button 
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95"
          >
            Close
          </button>
          <Link 
            to={`/edit-task/${task._id}`}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 active:scale-95"
          >
            Edit Task
          </Link>
        </div>
      </div>
    </div>
  );
}