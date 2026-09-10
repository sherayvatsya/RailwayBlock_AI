import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Zap, 
  Radio, 
  ShieldAlert,
  Train,
  X,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { 
  MaintenanceTask, 
  Department, 
  PriorityLevel, 
  UrgencyLevel, 
  AssetCriticality, 
  Corridor 
} from '../types';

interface TaskQueueViewProps {
  tasks: MaintenanceTask[];
  corridors: Corridor[];
  selectedCorridorId: string;
  onAddTask: (task: MaintenanceTask) => void;
  isNewTaskModalOpen: boolean;
  onCloseNewTaskModal: () => void;
  onOpenNewTaskModal: () => void;
  onTriggerOptimization: () => void;
}

export const TaskQueueView: React.FC<TaskQueueViewProps> = ({
  tasks,
  corridors,
  selectedCorridorId,
  onAddTask,
  isNewTaskModalOpen,
  onCloseNewTaskModal,
  onOpenNewTaskModal,
  onTriggerOptimization,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [selectedOverdueOnly, setSelectedOverdueOnly] = useState<boolean>(false);
  const [inspectedTask, setInspectedTask] = useState<MaintenanceTask | null>(null);

  // Available unique dates in the demand queue
  const availableDates = Array.from(
    new Set(tasks.map((t) => t.requestedDate).filter(Boolean))
  ).sort();

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    // Corridor filter
    if (selectedCorridorId !== 'ALL' && t.corridorId !== selectedCorridorId) {
      return false;
    }
    // Department filter
    if (selectedDept !== 'ALL' && t.department !== selectedDept) {
      return false;
    }
    // Priority filter
    if (selectedPriority !== 'ALL' && t.computedPriority !== selectedPriority) {
      return false;
    }
    // Working Date filter
    if (selectedDate !== 'ALL' && t.requestedDate !== selectedDate) {
      return false;
    }
    // Overdue filter
    if (selectedOverdueOnly && !t.overdue) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.sectionName.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        (t.requestedDate && t.requestedDate.includes(q))
      );
    }
    return true;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
            Critical 🔴
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            High 🟠
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
            Medium 🟡
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Low 🟢
          </span>
        );
    }
  };

  const getDeptIcon = (dept: Department) => {
    switch (dept) {
      case 'Engineering':
        return <Wrench className="w-3.5 h-3.5 text-blue-400" />;
      case 'TRD':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'S&T':
        return <Radio className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getDeptBadge = (dept: Department) => {
    switch (dept) {
      case 'Engineering':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Wrench className="w-3 h-3 text-blue-400" />
            Engineering
          </span>
        );
      case 'TRD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Zap className="w-3 h-3 text-amber-400" />
            TRD (Traction)
          </span>
        );
      case 'S&T':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Radio className="w-3 h-3 text-emerald-400" />
            S&T
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Action & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white font-['Chakra_Petch'] tracking-wide">
              Cross-Department Maintenance Demand Queue
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {filteredTasks.length} / {tasks.length} tasks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated maintenance requests awaiting automated joint clustering and timetable alignment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewTaskModal}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Submit New Request</span>
          </button>
          <button
            onClick={onTriggerOptimization}
            className="px-4 py-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
            <span>Auto-Group in Engine</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tasks, machines, KM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Working Date Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-500 shrink-0">Date:</span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-slate-200 font-medium w-full focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">All Working Dates</option>
            {availableDates.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-amber-300">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 shrink-0">Dept:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-transparent text-slate-200 font-medium w-full focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">All 3 Departments</option>
            <option value="Engineering" className="bg-slate-900 text-blue-300">Engineering (Tracks/Bridges)</option>
            <option value="TRD" className="bg-slate-900 text-amber-300">TRD (Traction OHE)</option>
            <option value="S&T" className="bg-slate-900 text-emerald-300">S&T (Signals/Comms)</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 shrink-0">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-transparent text-slate-200 font-medium w-full focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">All Priorities</option>
            <option value="Critical" className="bg-slate-900 text-red-400">Critical 🔴</option>
            <option value="High" className="bg-slate-900 text-orange-400">High 🟠</option>
            <option value="Medium" className="bg-slate-900 text-yellow-400">Medium 🟡</option>
            <option value="Low" className="bg-slate-900 text-emerald-400">Low 🟢</option>
          </select>
        </div>

        {/* Overdue Toggle */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Overdue Only</span>
          </span>
          <input
            type="checkbox"
            checked={selectedOverdueOnly}
            onChange={(e) => setSelectedOverdueOnly(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Task ID & Dept</th>
                <th className="py-3 px-4 font-semibold">Work Description</th>
                <th className="py-3 px-4 font-semibold">Location (Corridor & KM)</th>
                <th className="py-3 px-4 font-semibold">Duration</th>
                <th className="py-3 px-4 font-semibold">Severity Factors</th>
                <th className="py-3 px-4 font-semibold">Computed Priority</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-sm font-semibold text-slate-300">No matching maintenance tasks found</p>
                      <p className="text-xs text-slate-500">Try adjusting your filters or submit a new maintenance demand.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr 
                    key={task.id} 
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setInspectedTask(task)}
                  >
                    {/* Task ID & Dept */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                          {task.id}
                        </span>
                        <div>{getDeptBadge(task.department)}</div>
                      </div>
                    </td>

                    {/* Description & Machine */}
                    <td className="py-3 px-4 min-w-[280px]">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {task.description}
                        </div>
                        {task.machineRequired && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-300/90 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded w-fit border border-amber-500/20">
                            <span>Machine: {task.machineRequired}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-200 block">{task.sectionName}</span>
                        <span className="text-[11px] font-mono text-slate-400 block">
                          KM {task.kmStart}.0 — {task.kmEnd}.0 ({task.kmEnd - task.kmStart} KM Span)
                        </span>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] text-slate-500">{task.corridorName}</span>
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            <Calendar className="w-2.5 h-2.5 text-amber-400" />
                            {task.requestedDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.durationMinutes} min</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({(task.durationMinutes / 60).toFixed(1)} hrs)
                      </span>
                    </td>

                    {/* Severity Factors */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">Urgency:</span>
                          <span className="font-semibold text-slate-200">{task.urgency}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">Criticality:</span>
                          <span className="font-semibold text-slate-200">{task.assetCriticality}</span>
                        </div>
                        {task.overdue && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                            ⚠️ Overdue
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Computed Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getPriorityBadge(task.computedPriority)}
                        <div className="text-[10px] font-mono text-slate-400">
                          Score: <strong className="text-white">{task.computedScore}</strong>/100
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedTask(task);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 transition-colors"
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal */}
      {inspectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-amber-400">{inspectedTask.id}</span>
                  {getDeptBadge(inspectedTask.department)}
                  {getPriorityBadge(inspectedTask.computedPriority)}
                </div>
                <h3 className="text-base font-bold text-white">{inspectedTask.title}</h3>
              </div>
              <button
                onClick={() => setInspectedTask(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              {inspectedTask.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
                <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  Date for Working
                </span>
                <span className="font-semibold text-amber-300 font-mono text-xs">{inspectedTask.requestedDate}</span>
                {inspectedTask.targetWindowType && (
                  <span className="text-slate-400 block text-[10px] mt-0.5 font-mono">{inspectedTask.targetWindowType}</span>
                )}
              </div>

              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Corridor & Section</span>
                <span className="font-semibold text-slate-200">{inspectedTask.sectionName}</span>
                <span className="text-slate-400 block text-[10px] font-mono mt-0.5">
                  KM {inspectedTask.kmStart}.0 - {inspectedTask.kmEnd}.0
                </span>
              </div>

              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Block Duration Required</span>
                <span className="font-semibold text-slate-200 font-mono">{inspectedTask.durationMinutes} Minutes</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">({(inspectedTask.durationMinutes / 60).toFixed(1)} hrs)</span>
              </div>

              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60 sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Track Plant / Equipment</span>
                <span className="font-semibold text-amber-300 font-mono text-[11px]">
                  {inspectedTask.machineRequired || 'Manual Gang Working (No Heavy Plant)'}
                </span>
              </div>

              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Safety Staff Protection</span>
                <span className="font-semibold text-slate-200">{inspectedTask.safetyStaffRequired} Flagmen & Lookout staff</span>
              </div>
            </div>

            {/* Block Requirement Flags */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-400">Operating Block Pre-requisites:</span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className={`p-2 rounded border ${inspectedTask.trafficBlockNeeded ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                  ✓ Traffic Block: {inspectedTask.trafficBlockNeeded ? 'Required' : 'No'}
                </div>
                <div className={`p-2 rounded border ${inspectedTask.powerBlockNeeded ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                  ⚡ Power Block: {inspectedTask.powerBlockNeeded ? 'Required' : 'No'}
                </div>
                <div className={`p-2 rounded border ${inspectedTask.disconnectionNoticeNeeded ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                  📡 S&T Disconn: {inspectedTask.disconnectionNoticeNeeded ? 'Required' : 'No'}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectedTask(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
