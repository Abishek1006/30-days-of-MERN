import React from 'react';
import { TrendingUp, PieChart, BarChart3, Calendar } from 'lucide-react';

export default function AnalyticsDashboard({
  statusChartRef,
  categoryChartRef,
  trendChartRef,
}: {
  statusChartRef: React.RefObject<HTMLCanvasElement>;
  categoryChartRef: React.RefObject<HTMLCanvasElement>;
  trendChartRef: React.RefObject<HTMLCanvasElement>;
}) {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={28} />
          Analytics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ChartBlock title="Task Status Distribution" icon={<PieChart size={20} />} refCanvas={statusChartRef} />
          <ChartBlock title="Tasks by Category" icon={<BarChart3 size={20} />} refCanvas={categoryChartRef} />
          <ChartBlock title="7-Day Completion Trend" icon={<Calendar size={20} />} refCanvas={trendChartRef} />
        </div>
      </div>
    </div>
  );
}

function ChartBlock({
  title,
  icon,
  refCanvas,
}: {
  title: string;
  icon: React.ReactNode;
  refCanvas: React.RefObject<HTMLCanvasElement>;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="h-64">
        <canvas ref={refCanvas}></canvas>
      </div>
    </div>
  );
}
