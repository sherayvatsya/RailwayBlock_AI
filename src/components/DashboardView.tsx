import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  ArrowRight,
  CalendarCheck
} from 'lucide-react';
import { MaintenanceTask, BlockWindow, OptimizedBlock } from '../types';
import { soundFx } from '../utils/audioFx';
import { DashboardCharts } from './DashboardCharts';

interface DashboardViewProps {
  tasks: MaintenanceTask[];
  windows: BlockWindow[];
  optimizedBlocks: OptimizedBlock[];
  onNavigateToTab: (tab: string) => void;
  onTriggerOptimization: () => void;
  onOpenNewTaskModal: () => void;
  theme?: 'dark' | 'light';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  windows,
  optimizedBlocks,
  onNavigateToTab,
  onTriggerOptimization,
  onOpenNewTaskModal,
  theme = 'dark',
}) => {
  // Compute priority counts
  const criticalCount = tasks.filter((t) => t.computedPriority === 'Critical').length;
  const highCount = tasks.filter((t) => t.computedPriority === 'High').length;
  const mediumCount = tasks.filter((t) => t.computedPriority === 'Medium').length;
  const lowCount = tasks.filter((t) => t.computedPriority === 'Low').length;
  const overdueCount = tasks.filter((t) => t.overdue).length;

  const approvedBlocks = optimizedBlocks.filter((b) => b.status === 'Approved');

  // Calculate dynamic granted-to-demand utilization percentage
  // Base demand starts around 58%, increases up to ~74% when blocks are optimized & approved
  const approvedRatio = optimizedBlocks.length > 0 ? (approvedBlocks.length / optimizedBlocks.length) : 0;
  const currentUtilization = optimizedBlocks.length === 0 ? 58.4 : Math.min(78.2, Number((62.0 + approvedRatio * 14.5 + (optimizedBlocks.length > 0 ? 3.5 : 0)).toFixed(1)));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome / Pitch Context Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-5 md:p-6 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Multi-Department Convergence
              </span>
              <span className="text-xs text-slate-400">South Central & East Coast Railway Precedents</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-['Chakra_Petch'] tracking-wide">
              Smart Maintenance Block Coordination & Conflict Resolution
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Consolidating independent requests from <span className="text-blue-400 font-semibold">Engineering</span>, <span className="text-amber-400 font-semibold">Traction (TRD)</span>, and <span className="text-emerald-400 font-semibold">S&T</span> into unified joint blocks — matching train timetable gaps to eliminate track downtime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateToTab('tasks')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5"
            >
              <span>View Task Queue ({tasks.length})</span>
            </button>
            <button
              onClick={() => {
                onTriggerOptimization();
                onNavigateToTab('engine');
              }}
              className="px-4 py-2 rounded-lg bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
              <span>Launch AI Optimizer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Tasks */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">{tasks.length}</span>
            <span className="text-xs text-slate-400">across 3 departments</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="font-semibold text-red-400">{overdueCount} Overdue</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">{criticalCount + highCount} Urgent</span>
          </div>
        </div>

        {/* Card 2: Priority Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Critical / High Severity</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-sm">🔴</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-red-400 font-mono">{criticalCount + highCount}</span>
            <span className="text-xs text-slate-400">tasks need urgent window</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-medium">{criticalCount} Critical</span>
            <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-medium">{highCount} High</span>
            <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-medium">{mediumCount} Med</span>
          </div>
        </div>

        {/* Card 3: Available Block Windows */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Available Track Windows</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{windows.filter(w => w.isAvailable).length} Slots</span>
            <span className="text-xs text-slate-400">this week</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Night Windows & Jumbo Blocks</span>
          </div>
        </div>

        {/* Card 4: Granted-to-Demand Utilization */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Granted-to-Demand KPI</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{currentUtilization}%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-slate-400 text-[11px]">Benchmarked against ECoR Rolling Block (73%)</span>
          </div>
        </div>
      </div>

      {/* Cross-Department Maintenance Demand & Priority Ranking Matrix Charts */}
      <DashboardCharts tasks={tasks} theme={theme} />

      {/* Quick Launchpad to Optimizer or Review */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Ready for Planning Simulation?</h2>
            <p className="text-xs text-slate-400">
              {optimizedBlocks.length > 0 
                ? `${optimizedBlocks.length} optimized blocks generated (${approvedBlocks.length} approved by controller)` 
                : 'Run the 3-step greedy heuristic engine to consolidate all pending maintenance tasks.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {optimizedBlocks.length > 0 ? (
            <button
              onClick={() => {
                soundFx.playClick();
                onNavigateToTab('review');
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Planner Review Screen ({optimizedBlocks.filter(b => b.status === 'Awaiting Review').length} Pending)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                soundFx.playOptimizationPlanSuccess();
                onTriggerOptimization();
                onNavigateToTab('engine');
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
              <span>Execute Optimization</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
