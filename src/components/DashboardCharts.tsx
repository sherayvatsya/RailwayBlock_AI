import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Wrench, Zap, Radio } from 'lucide-react';
import { MaintenanceTask } from '../types';

interface DashboardChartsProps {
  tasks: MaintenanceTask[];
  theme?: 'dark' | 'light';
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  tasks,
  theme = 'dark',
}) => {
  // Department breakdown
  const engTasks = tasks.filter((t) => t.department === 'Engineering');
  const trdTasks = tasks.filter((t) => t.department === 'TRD');
  const stTasks = tasks.filter((t) => t.department === 'S&T');

  const engHighCrit = engTasks.filter(
    (t) => t.computedPriority === 'Critical' || t.computedPriority === 'High'
  ).length;
  const trdHighCrit = trdTasks.filter(
    (t) => t.computedPriority === 'Critical' || t.computedPriority === 'High'
  ).length;
  const stHighCrit = stTasks.filter(
    (t) => t.computedPriority === 'Critical' || t.computedPriority === 'High'
  ).length;

  const barData = [
    {
      name: 'Engineering',
      totalTasks: engTasks.length,
      highCritical: engHighCrit,
    },
    {
      name: 'TRD (Traction)',
      totalTasks: trdTasks.length,
      highCritical: trdHighCrit,
    },
    {
      name: 'S&T',
      totalTasks: stTasks.length,
      highCritical: stHighCrit,
    },
  ];

  // Priority breakdown
  const criticalCount = tasks.filter((t) => t.computedPriority === 'Critical').length;
  const highCount = tasks.filter((t) => t.computedPriority === 'High').length;
  const mediumCount = tasks.filter((t) => t.computedPriority === 'Medium').length;
  const lowCount = tasks.filter((t) => t.computedPriority === 'Low').length;

  const pieData = [
    { name: 'Critical', value: criticalCount, color: '#ef4444' },
    { name: 'High', value: highCount, color: '#f97316' },
    { name: 'Medium', value: mediumCount, color: '#eab308' },
    { name: 'Low', value: lowCount, color: '#22c55e' },
  ];

  const isLight = theme === 'light';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Card: Cross-Department Maintenance Demand */}
      <div
        className={`lg:col-span-8 rounded-2xl p-5 md:p-6 border transition-all flex flex-col justify-between ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#0b1324] border-slate-800 shadow-xl'
        }`}
      >
        <div>
          {/* Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div>
              <h3
                className={`text-base font-bold font-['Chakra_Petch'] tracking-wide ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Cross-Department Maintenance Demand{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">
                  [Demands received from field units]
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Comparison of total requests vs high-criticality work across Engineering, Traction (TRD), and S&T.
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-300 shrink-0 self-start sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-xs"></span>
                <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>
                  Total Tasks
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ef4444] shadow-xs"></span>
                <span className={isLight ? 'text-slate-700' : 'text-slate-200'}>
                  High / Critical
                </span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                barGap={8}
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  vertical={false}
                  stroke={isLight ? '#f1f5f9' : '#1e293b'}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: isLight ? '#cbd5e1' : '#1e293b' }}
                  tick={{
                    fill: isLight ? '#475569' : '#94a3b8',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />
                <YAxis
                  ticks={[0, 3, 6, 9, 12]}
                  domain={[0, 12]}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: isLight ? '#64748b' : '#64748b',
                    fontSize: 11,
                    fontFamily: 'monospace',
                  }}
                />
                <Tooltip
                  cursor={{ fill: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div
                        className={`p-3 rounded-xl border text-xs shadow-xl backdrop-blur-md ${
                          isLight
                            ? 'bg-white/95 border-slate-200 text-slate-800'
                            : 'bg-slate-900/95 border-slate-700 text-slate-100'
                        }`}
                      >
                        <p className="font-bold mb-1.5 font-['Chakra_Petch'] text-sm">
                          {data.name}
                        </p>
                        <div className="flex items-center justify-between gap-4 py-0.5">
                          <span className="flex items-center gap-1.5 text-blue-500 font-medium">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Total Tasks:
                          </span>
                          <span className="font-mono font-bold">{data.totalTasks}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 py-0.5">
                          <span className="flex items-center gap-1.5 text-red-500 font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            High / Critical:
                          </span>
                          <span className="font-mono font-bold">{data.highCritical}</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="totalTasks"
                  name="Total Tasks"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
                <Bar
                  dataKey="highCritical"
                  name="High / Critical"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3 Department Stat Blocks Below Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800/40">
          {/* Engineering */}
          <div
            className={`rounded-xl p-3 border transition-colors ${
              isLight
                ? 'bg-slate-50/80 border-slate-200'
                : 'bg-[#070d18] border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
              <Wrench className="w-3.5 h-3.5 text-blue-400" />
              <span>Engineering</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {engTasks.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Tracks, Bridges</span>
            </div>
          </div>

          {/* TRD (Traction) */}
          <div
            className={`rounded-xl p-3 border transition-colors ${
              isLight
                ? 'bg-slate-50/80 border-slate-200'
                : 'bg-[#070d18] border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>TRD (Traction)</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {trdTasks.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">OHE, Power</span>
            </div>
          </div>

          {/* S&T (Signals) */}
          <div
            className={`rounded-xl p-3 border transition-colors ${
              isLight
                ? 'bg-slate-50/80 border-slate-200'
                : 'bg-[#070d18] border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>S&T (Signals)</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {stTasks.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Interlocking, Axle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Card: Priority Ranking Matrix */}
      <div
        className={`lg:col-span-4 rounded-2xl p-5 md:p-6 border transition-all flex flex-col justify-between ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#0b1324] border-slate-800 shadow-xl'
        }`}
      >
        <div>
          {/* Header */}
          <div className="mb-2">
            <h3
              className={`text-base font-bold font-['Chakra_Petch'] tracking-wide ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Priority Ranking Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Weighted algorithm scoring (Urgency + Criticality + Overdue)
            </p>
          </div>

          {/* Donut Chart with Center Number */}
          <div className="relative h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke={isLight ? '#ffffff' : '#0b1324'}
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div
                        className={`px-3 py-1.5 rounded-lg border text-xs shadow-lg ${
                          isLight
                            ? 'bg-white border-slate-200 text-slate-900'
                            : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      >
                        <span className="font-bold">{data.name}: </span>
                        <span className="font-mono">{data.value} tasks</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Hole Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span
                className={`text-3xl font-black font-mono tracking-tight leading-none ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {tasks.length}
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
                TASKS
              </span>
            </div>
          </div>
        </div>

        {/* 2x2 Priority Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-slate-800/40">
          {/* Critical */}
          <div
            className={`rounded-xl px-3 py-2.5 border flex items-center gap-2 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#070d18] border-slate-800/80'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
            <div className="flex items-baseline gap-1 text-xs">
              <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                Critical:
              </span>
              <span
                className={`font-black font-mono text-sm ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {criticalCount}
              </span>
            </div>
          </div>

          {/* High */}
          <div
            className={`rounded-xl px-3 py-2.5 border flex items-center gap-2 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#070d18] border-slate-800/80'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
            <div className="flex items-baseline gap-1 text-xs">
              <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                High:
              </span>
              <span
                className={`font-black font-mono text-sm ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {highCount}
              </span>
            </div>
          </div>

          {/* Medium */}
          <div
            className={`rounded-xl px-3 py-2.5 border flex items-center gap-2 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#070d18] border-slate-800/80'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0"></span>
            <div className="flex items-baseline gap-1 text-xs">
              <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                Medium:
              </span>
              <span
                className={`font-black font-mono text-sm ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {mediumCount}
              </span>
            </div>
          </div>

          {/* Low */}
          <div
            className={`rounded-xl px-3 py-2.5 border flex items-center gap-2 ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#070d18] border-slate-800/80'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <div className="flex items-baseline gap-1 text-xs">
              <span className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                Low:
              </span>
              <span
                className={`font-black font-mono text-sm ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {lowCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
