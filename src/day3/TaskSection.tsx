import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '../types';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

type Props = {
  title: string;
  icon: React.ReactNode;
  color: string;
  tasks: Task[];
  sectionFilter: (t: Task) => boolean;
  isOverdue: (t: Task) => boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onToggle: (index: number) => void;
  getCategoryColor: (cat: string) => string;
  formatDate: (d: string, t: string) => string;
};

export default function TaskSection({ title, icon, color, tasks, sectionFilter, isOverdue, onEdit, onDelete, onToggle, getCategoryColor, formatDate }: Props) {
  const visibleTasks = tasks.map((t, i) => ({ task: t, index: i })).filter(({ task }) => sectionFilter(task));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <h2 className={`text-2xl font-bold ${color.replace('bg-', 'text-')}`}>{title}</h2>
      </div>
      <div className="space-y-4">
        {visibleTasks.length === 0 ? (
          <p className="text-center text-gray-500 italic py-4">No {title.toLowerCase()}.</p>
        ) : (
          visibleTasks.map(({ task, index }) => (
            <TaskCard
              key={index}
              task={task}
              index={index}
              isOverdue={isOverdue(task)}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggle}
              getCategoryColor={getCategoryColor}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}
