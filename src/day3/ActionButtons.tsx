import React from 'react';
import { Plus, BarChart3 } from 'lucide-react';

type Props = {
  onAddTask: () => void;
  onToggleAnalytics: () => void;
  showAnalytics: boolean;
};

export default function ActionButtons({ onAddTask, onToggleAnalytics, showAnalytics }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      <button
        onClick={onAddTask}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
      >
        <Plus size={20} />
        Add New Task
      </button>
      <button
        onClick={onToggleAnalytics}
        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
      >
        <BarChart3 size={20} />
        {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
      </button>
    </div>
  );
}
