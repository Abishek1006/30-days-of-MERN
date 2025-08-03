import React from 'react';
import { Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';
import { Task } from '../types';

type Props = {
  task: Task;
  index: number;
  isOverdue: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onToggleStatus: (index: number) => void;
  getCategoryColor: (category: string) => string;
  formatDate: (date: string, time: string) => string;
};

export default function TaskCard({
  task,
  index,
  isOverdue,
  onEdit,
  onDelete,
  onToggleStatus,
  getCategoryColor,
  formatDate
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => onToggleStatus(index)}
              className={`p-1 rounded-full transition-all duration-200 ${
                task.status === 'completed'
                  ? 'text-green-600 hover:text-green-700 bg-green-50'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CheckCircle size={22} />
            </button>
            <div className="flex-1">
              <h3 className={`font-semibold text-lg mb-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.taskname}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category || 'Work')}`}>
                {task.category || 'Work'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>{formatDate(task.taskdate, task.tasktime)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : isOverdue
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {task.status === 'completed' ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={() => onEdit(index)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
