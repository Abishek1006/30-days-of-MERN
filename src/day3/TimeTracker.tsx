import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Clock, CheckCircle, AlertTriangle, X, BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import * as Chart from 'chart.js/auto';

type Props = {};

type Task = {
  taskname: string;
  taskdate: string;
  tasktime: string;
  status: 'completed' | 'pending';
  category?: string;
};

export default function TimeTracker({}: Props) {
  const [taskEntrySectionVisible, SetTaskEntrySectionVisible] = useState(false);
  const [tasks, SetTasks] = useState<Task[]>([]);
  const [taskname, SetTaskname] = useState('');
  const [taskdate, SetTaskdate] = useState('');
  const [tasktime, SetTasktime] = useState('');
  const [status, SetStatus] = useState<'completed' | 'pending'>('pending');
  const [category, SetCategory] = useState('Work');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const trendChartRef = useRef<HTMLCanvasElement>(null);
  const statusChartInstance = useRef<Chart.Chart | null>(null);
  const categoryChartInstance = useRef<Chart.Chart | null>(null);
  const trendChartInstance = useRef<Chart.Chart | null>(null);

  const categories = ['Work', 'Personal', 'Health', 'Learning', 'Shopping', 'Other'];

  useEffect(() => {
    if (showAnalytics) {
      setTimeout(() => {
        createCharts();
      }, 100);
    }
    
    return () => {
      destroyCharts();
    };
  }, [showAnalytics, tasks]);

  const destroyCharts = () => {
    if (statusChartInstance.current) {
      statusChartInstance.current.destroy();
      statusChartInstance.current = null;
    }
    if (categoryChartInstance.current) {
      categoryChartInstance.current.destroy();
      categoryChartInstance.current = null;
    }
    if (trendChartInstance.current) {
      trendChartInstance.current.destroy();
      trendChartInstance.current = null;
    }
  };

  const createCharts = () => {
    destroyCharts();

    // Status Distribution Doughnut Chart
    if (statusChartRef.current) {
      const completed = tasks.filter(t => t.status === 'completed').length;
      const pending = tasks.filter(t => t.status === 'pending' && !isPastDeadline(t)).length;
      const overdue = tasks.filter(t => isPastDeadline(t)).length;

      statusChartInstance.current = new Chart.Chart(statusChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Pending', 'Overdue'],
          datasets: [{
            data: [completed, pending, overdue],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(234, 179, 8, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(234, 179, 8, 1)',
              'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          }
        }
      });
    }

    // Category Distribution Bar Chart
    if (categoryChartRef.current) {
      const categoryData = categories.map(cat => 
        tasks.filter(t => (t.category || 'Work') === cat).length
      );

      categoryChartInstance.current = new Chart.Chart(categoryChartRef.current, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Tasks by Category',
            data: categoryData,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // Completion Trend Line Chart
    if (trendChartRef.current) {
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const completionData = last7Days.map(date => 
        tasks.filter(t => t.taskdate === date && t.status === 'completed').length
      );

      trendChartInstance.current = new Chart.Chart(trendChartRef.current, {
        type: 'line',
        data: {
          labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})),
          datasets: [{
            label: 'Tasks Completed',
            data: completionData,
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  };

  const addtotask = () => {
    if (!taskname.trim() || !taskdate || !tasktime) return;
    
    const newTask: Task = { taskname, taskdate, tasktime, status, category };

    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = newTask;
      SetTasks(updated);
      setEditingIndex(null);
    } else {
      SetTasks([...tasks, newTask]);
    }

    SetTaskname('');
    SetTaskdate('');
    SetTasktime('');
    SetStatus('pending');
    SetCategory('Work');
    SetTaskEntrySectionVisible(false);
  };

  const deleteTask = (index: number) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    SetTasks(updated);
  };

  const editTask = (index: number) => {
    const t = tasks[index];
    SetTaskname(t.taskname);
    SetTaskdate(t.taskdate);
    SetTasktime(t.tasktime);
    SetStatus(t.status);
    SetCategory(t.category || 'Work');
    setEditingIndex(index);
    SetTaskEntrySectionVisible(true);
  };

  const toggleTaskStatus = (index: number) => {
    const updated = [...tasks];
    updated[index].status = updated[index].status === 'completed' ? 'pending' : 'completed';
    SetTasks(updated);
  };

  const isPastDeadline = (task: Task): boolean => {
    const deadline = new Date(`${task.taskdate}T${task.tasktime}`);
    return task.status === 'pending' && new Date() > deadline;
  };

  const formatDate = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const closeForm = () => {
    SetTaskEntrySectionVisible(false);
    setEditingIndex(null);
    SetTaskname('');
    SetTaskdate('');
    SetTasktime('');
    SetStatus('pending');
    SetCategory('Work');
  };

  const getStats = () => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending' && !isPastDeadline(t)).length;
    const overdue = tasks.filter(t => isPastDeadline(t)).length;
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, pending, overdue, total, completionRate };
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-800',
      'Personal': 'bg-purple-100 text-purple-800',
      'Health': 'bg-green-100 text-green-800',
      'Learning': 'bg-indigo-100 text-indigo-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const renderTasks = (filterFn: (t: Task) => boolean, emptyMessage: string) => {
    const filteredTasks = tasks
      .map((t, index) => ({ ...t, index }))
      .filter(({ index, ...t }) => filterFn(t));

    if (filteredTasks.length === 0) {
      return <p className="text-gray-500 italic text-center py-8">{emptyMessage}</p>;
    }

    return filteredTasks.map(({ taskname, taskdate, tasktime, status, category, index }) => (
      <div key={index} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => toggleTaskStatus(index)}
                className={`p-1 rounded-full transition-all duration-200 ${
                  status === 'completed' 
                    ? 'text-green-600 hover:text-green-700 bg-green-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CheckCircle size={22} />
              </button>
              <div className="flex-1">
                <h3 className={`font-semibold text-lg mb-1 ${status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {taskname}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category || 'Work')}`}>
                    {category || 'Work'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{formatDate(taskdate, tasktime)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : isPastDeadline({ taskname, taskdate, tasktime, status, category })
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {status === 'completed' ? 'Completed' : isPastDeadline({ taskname, taskdate, tasktime, status, category }) ? 'Overdue' : 'Pending'}
              </span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => editTask(index)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => deleteTask(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold text-center mb-4">Task Manager Pro</h1>
          <p className="text-blue-100 text-center text-lg">Stay organized and track your progress with powerful analytics</p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-blue-100">Total Tasks</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-300">{stats.completed}</div>
              <div className="text-sm text-blue-100">Completed</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-300">{stats.pending}</div>
              <div className="text-sm text-blue-100">Pending</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <div className="text-sm text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => SetTaskEntrySectionVisible(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
          >
            <Plus size={20} />
            Add New Task
          </button>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
          >
            <BarChart3 size={20} />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-purple-600" size={28} />
                Analytics Dashboard
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <PieChart size={20} />
                    Task Status Distribution
                  </h3>
                  <div className="h-64">
                    <canvas ref={statusChartRef}></canvas>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <BarChart3 size={20} />
                    Tasks by Category
                  </h3>
                  <div className="h-64">
                    <canvas ref={categoryChartRef}></canvas>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    7-Day Completion Trend
                  </h3>
                  <div className="h-64">
                    <canvas ref={trendChartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Entry Form Modal */}
        {taskEntrySectionVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingIndex !== null ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => SetTaskname(e.target.value)}
                    value={taskname}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => SetCategory(e.target.value)}
                    value={category}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={(e) => SetTaskdate(e.target.value)}
                      value={taskdate}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={(e) => SetTasktime(e.target.value)}
                      value={tasktime}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    onChange={(e) => SetStatus(e.target.value as 'completed' | 'pending')}
                    value={status}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={closeForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={addtotask}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg"
                >
                  {editingIndex !== null ? 'Update Task' : 'Save Task'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Sections */}
        <div className="space-y-8">
          {/* Overdue Tasks */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-red-600">Overdue Tasks</h2>
            </div>
            <div className="space-y-4">
              {renderTasks((t) => isPastDeadline(t), "No overdue tasks! You're doing amazing! 🎉")}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-yellow-600">Pending Tasks</h2>
            </div>
            <div className="space-y-4">
              {renderTasks((t) => t.status === 'pending' && !isPastDeadline(t), "No pending tasks. Ready for new challenges! 🚀")}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-green-600">Completed Tasks</h2>
            </div>
            <div className="space-y-4">
              {renderTasks((t) => t.status === 'completed', "No completed tasks yet. You've got this! 💪")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}