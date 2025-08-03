import React from 'react';

type Props = {
  stats: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
};

export default function HeaderStats({ stats }: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-4">Task Manager</h1>
      <p className="text-blue-100 text-center text-lg">Stay organized and track your progress with powerful analytics</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} color="text-green-300" />
        <StatCard label="Pending" value={stats.pending} color="text-yellow-300" />
        <StatCard label="Success Rate" value={`${stats.completionRate}%`} />
      </div>
    </div>
  );
}

function StatCard({ label, value, color = '' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-blue-100">{label}</div>
    </div>
  );
}
