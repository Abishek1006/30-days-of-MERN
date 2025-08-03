import React, { useState, useEffect, useRef } from 'react';
import TaskSection from './TaskSection';
import TaskFormModal from './TaskFormModal';
import AnalyticsDashboard from './AnalyticsDashboard';
import { Task } from './types';
import { Plus, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import Chart from 'chart.js/auto';

export default function TimeTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({ taskname: '', taskdate: '', tasktime: '', status: 'pending', category: 'Work' });
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const categories = ['Work', 'Study', 'Personal'];

  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const trendChartRef = useRef<HTMLCanvasElement>(null);
  const statusChartInstance = useRef<Chart | null>(null);
const categoryChartInstance = useRef<Chart | null>(null);
const trendChartInstance = useRef<Chart | null>(null);


  // Handle input changes
  const handleChange = (field: keyof Task, value: string) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedTasks = [...tasks];
    if (editIndex !== null) {
      updatedTasks[editIndex] = newTask;
    } else {
      updatedTasks.push(newTask);
    }
    setTasks(updatedTasks);
    setShowModal(false);
    setNewTask({ taskname: '', taskdate: '', tasktime: '', status: 'pending', category: 'Work' });
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const handleToggleStatus = (index: number) => {
    const updated = [...tasks];
    updated[index].status = updated[index].status === 'completed' ? 'pending' : 'completed';
    setTasks(updated);
  };

  const isOverdue = (task: Task) => {
    if (task.status === 'completed') return false;
    const due = new Date(`${task.taskdate}T${task.tasktime}`);
    return due < new Date();
  };

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      Work: 'bg-blue-100 text-blue-800',
      Study: 'bg-green-100 text-green-800',
      Personal: 'bg-yellow-100 text-yellow-800',
    };
    return map[cat] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (date: string, time: string) => {
    const d = new Date(`${date}T${time}`);
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const openEditModal = (index: number) => {
    setNewTask(tasks[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  useEffect(() => {
    renderCharts();
  }, [tasks]);

 const renderCharts = () => {
  const statusCount = { pending: 0, completed: 0 };
  const categoryCount: Record<string, number> = {};
  const trend: Record<string, number> = {};

  tasks.forEach(t => {
    statusCount[t.status]++;
    categoryCount[t.category || 'Uncategorized'] = (categoryCount[t.category || 'Uncategorized'] || 0) + 1;

    if (t.status === 'completed') {
      const day = new Date(t.taskdate).toLocaleDateString();
      trend[day] = (trend[day] || 0) + 1;
    }
  });

  // Destroy existing charts before creating new ones
  statusChartInstance.current?.destroy();
  categoryChartInstance.current?.destroy();
  trendChartInstance.current?.destroy();

  if (statusChartRef.current) {
    statusChartInstance.current = new Chart(statusChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Completed'],
        datasets: [{ data: [statusCount.pending, statusCount.completed], backgroundColor: ['#facc15', '#4ade80'] }],
      },
    });
  }

  if (categoryChartRef.current) {
    categoryChartInstance.current = new Chart(categoryChartRef.current, {
      type: 'bar',
      data: {
        labels: Object.keys(categoryCount),
        datasets: [{ label: 'Tasks', data: Object.values(categoryCount), backgroundColor: '#60a5fa' }],
      },
    });
  }

  if (trendChartRef.current) {
    trendChartInstance.current = new Chart(trendChartRef.current, {
      type: 'line',
      data: {
        labels: Object.keys(trend),
        datasets: [{ label: 'Completed', data: Object.values(trend), borderColor: '#6366f1', fill: false }],
      },
    });
  }
};


  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        <button
          onClick={() => {
            setNewTask({ taskname: '', taskdate: '', tasktime: '', status: 'pending', category: 'Work' });
            setEditIndex(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg transition-all"
        >
          <Plus /> New Task
        </button>
      </div>

      <AnalyticsDashboard
        statusChartRef={statusChartRef}
        categoryChartRef={categoryChartRef}
        trendChartRef={trendChartRef}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <TaskSection
          title="Overdue"
          icon={<AlertTriangle className="text-red-600" />}
          color="bg-red-100"
          tasks={tasks}
          sectionFilter={(t) => isOverdue(t)}
          isOverdue={isOverdue}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onToggle={handleToggleStatus}
          getCategoryColor={getCategoryColor}
          formatDate={formatDateTime}
        />
        <TaskSection
          title="Pending"
          icon={<Clock className="text-yellow-500" />}
          color="bg-yellow-100"
          tasks={tasks}
          sectionFilter={(t) => t.status === 'pending' && !isOverdue(t)}
          isOverdue={isOverdue}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onToggle={handleToggleStatus}
          getCategoryColor={getCategoryColor}
          formatDate={formatDateTime}
        />
        <TaskSection
          title="Completed"
          icon={<CheckCircle className="text-green-600" />}
          color="bg-green-100"
          tasks={tasks}
          sectionFilter={(t) => t.status === 'completed'}
          isOverdue={isOverdue}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onToggle={handleToggleStatus}
          getCategoryColor={getCategoryColor}
          formatDate={formatDateTime}
        />
      </div>

      <TaskFormModal
        visible={showModal}
        editing={editIndex !== null}
        task={newTask}
        categories={categories}
        onClose={() => setShowModal(false)}
        onChange={handleChange}
        onSave={handleSave}
      />
    </div>
  );
}
