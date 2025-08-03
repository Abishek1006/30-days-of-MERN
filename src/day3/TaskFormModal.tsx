import React from 'react';
import { X } from 'lucide-react';
import { Task } from '../types';

type Props = {
  visible: boolean;
  editing: boolean;
  task: Task;
  categories: string[];
  onClose: () => void;
  onChange: (field: keyof Task, value: string) => void;
  onSave: () => void;
};

export default function TaskFormModal({ visible, editing, task, categories, onClose, onChange, onSave }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{editing ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <Input label="Task Title" type="text" value={task.taskname} onChange={(val) => onChange('taskname', val)} />

          <Select label="Category" value={task.category || 'Work'} options={categories} onChange={(val) => onChange('category', val)} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Due Date" type="date" value={task.taskdate} onChange={(val) => onChange('taskdate', val)} />
            <Input label="Due Time" type="time" value={task.tasktime} onChange={(val) => onChange('tasktime', val)} />
          </div>

          <Select label="Status" value={task.status} options={['pending', 'completed']} onChange={(val) => onChange('status', val)} />
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold">
            Cancel
          </button>
          <button onClick={onSave} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg">
            {editing ? 'Update Task' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (val: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
