import WeatherBadge from './WeatherBadge';

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

export interface TaskCardProps {
  task: Task;
  onSelect: () => void;
  onStatusChange: (taskId: string, newStatus: string, e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function TaskCard({ task, onSelect, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  return (
    <div 
      onClick={onSelect}
      className="group relative flex cursor-pointer flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] hover:border-blue-200"
    >
      <div>
        {/* Title & Description */}
        <h3 className="mb-1.5 text-xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
          {task.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {task.description}
        </p>
        
        {/* Status & Priority Badges */}
        <div className="mb-5 flex flex-wrap gap-2 text-xs font-bold">
          <select 
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value, e)}
            onClick={(e) => e.stopPropagation()}
            className={`cursor-pointer rounded-full px-3 py-1.5 outline-none transition-all appearance-none ${
              task.status === 'DONE' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 hover:bg-emerald-100' : 
              task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-500/20 hover:bg-amber-100' : 
              'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-500/20 hover:bg-blue-100'
            }`}
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          
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
            {task.priority}
          </span>

        </div>
        
        {/* Metadata Details (Location, Weather, Date) */}
        <div className="space-y-2 rounded-2xl bg-gray-50/50 p-3 border border-gray-100/50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="text-sm">📍</span> {task.location}
            </span>
            <WeatherBadge weather={task.weather} />
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <span className="text-sm">📅</span> Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Image Preview - Updated to use object-contain */}
      {task.fileUrl && (
        <div className="mt-5 flex justify-center bg-gray-900/5 rounded-2xl border border-gray-100 p-2 overflow-hidden">
          <img 
            src={task.fileUrl} 
            alt="Task attachment" 
            className="h-36 w-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex gap-3 border-t border-gray-100 pt-5">
        <button 
          onClick={onEdit}
          className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
        >
          Edit
        </button>
        <button 
          onClick={onDelete}
          className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 active:scale-95"
        >
          Delete
        </button>
      </div>
    </div>
  );
}