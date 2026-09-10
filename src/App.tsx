import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Cpu, 
  UserCheck, 
  Sliders, 
  Calendar, 
  Sparkles,
  Train,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  MaintenanceTask, 
  BlockWindow, 
  TrainSchedule, 
  OptimizedBlock, 
  Corridor 
} from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_BLOCK_WINDOWS, 
  INITIAL_TRAIN_SCHEDULES, 
  INITIAL_CORRIDORS 
} from './data/mockData';
import { runOptimization } from './utils/optimizationEngine';
import { soundFx } from './utils/audioFx';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TaskQueueView } from './components/TaskQueueView';
import { OptimizationEngineView } from './components/OptimizationEngineView';
import { PlannerReviewView } from './components/PlannerReviewView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { NewTaskModal } from './components/NewTaskModal';

export default function App() {
  // Theme state: dark mode (default) vs light / white mode
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('railblock_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('railblock_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Application Data States
  const [tasks, setTasks] = useState<MaintenanceTask[]>(INITIAL_TASKS);
  const [windows, setWindows] = useState<BlockWindow[]>(INITIAL_BLOCK_WINDOWS);
  const [trains, setTrains] = useState<TrainSchedule[]>(INITIAL_TRAIN_SCHEDULES);
  const [corridors] = useState<Corridor[]>(INITIAL_CORRIDORS);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'tasks' | 'engine' | 'review' | 'whatif' | 'weekly'
  >('dashboard');

  // Selected Corridor Filter across all tabs
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('ALL');

  // Modal State for New Task
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Initial Auto-run Optimization so the user immediately sees ready data
  const [optimizedBlocks, setOptimizedBlocks] = useState<OptimizedBlock[]>(() => {
    const { optimizedBlocks: initialBlocks } = runOptimization(
      INITIAL_TASKS,
      INITIAL_BLOCK_WINDOWS,
      INITIAL_TRAIN_SCHEDULES
    );
    return initialBlocks;
  });

  // Master optimization handler
  const handleTriggerOptimization = () => {
    const { optimizedBlocks: newBlocks, summary } = runOptimization(tasks, windows, trains);
    setOptimizedBlocks(newBlocks);
    showToast(`Optimization complete: ${newBlocks.length} joint blocks generated! Saved ${summary.hoursSaved}h track capacity.`);
  };

  // Add Task handler
  const handleAddTask = (newTask: MaintenanceTask) => {
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    // Re-run optimization with new task
    const { optimizedBlocks: newBlocks } = runOptimization(updatedTasks, windows, trains);
    setOptimizedBlocks(newBlocks);
    showToast(`Task ${newTask.id} added for ${newTask.requestedDate} with priority score ${newTask.computedScore}/100.`);
  };

  // Approve Block handler
  const handleApproveBlock = (blockId: string, notes?: string) => {
    setOptimizedBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              status: 'Approved',
              plannerNotes: notes || b.plannerNotes,
              approvedAt: new Date().toISOString(),
              approvedBy: 'Chief Controller (Operating)',
            }
          : b
      )
    );
    showToast(`Block ${blockId} officially sanctioned for master schedule!`, 'success');
  };

  // Approve All Blocks handler
  const handleApproveAllBlocks = () => {
    setOptimizedBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        status: 'Approved',
        plannerNotes: 'Sanctioned during Master Joint Optimization run',
        approvedAt: new Date().toISOString(),
        approvedBy: 'Chief Controller (Operating)',
      }))
    );
    showToast(`All generated blocks sanctioned into official Master Schedule!`, 'success');
  };

  // Reject Block handler
  const handleRejectBlock = (blockId: string, reason?: string) => {
    setOptimizedBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              status: 'Rejected',
              plannerNotes: reason ? `Rejected: ${reason}` : 'Rejected by controller',
            }
          : b
      )
    );
    showToast(`Block ${blockId} rejected and queued for rescheduling.`, 'info');
  };

  // Modify Block handler
  const handleModifyBlock = (updatedBlock: OptimizedBlock) => {
    setOptimizedBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
    showToast(`Block ${updatedBlock.blockCode} timing modified.`, 'info');
  };

  // Apply Simulated Plan from What-If Simulator
  const handleApplySimulatedPlan = (newTasks: MaintenanceTask[], newBlocks: OptimizedBlock[]) => {
    setTasks(newTasks);
    setOptimizedBlocks(newBlocks);
    showToast(`Simulated scenario plan adopted into review queue!`);
  };

  const pendingReviewCount = optimizedBlocks.filter((b) => b.status === 'Awaiting Review').length;
  const approvedBlocksCount = optimizedBlocks.filter((b) => b.status === 'Approved').length;

  const navTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks',
      label: 'Task Queue',
      icon: Layers,
      badge: tasks.length,
    },
    {
      id: 'engine',
      label: 'AI Planning Engine',
      icon: Cpu,
      badge: '3-Step Heuristic',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'review',
      label: 'Planner Review',
      icon: UserCheck,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} Pending` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'weekly',
      label: 'Weekly Schedule',
      icon: Calendar,
      badge: `${approvedBlocksCount} Sanctioned`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top App Header */}
      <Header
        corridors={corridors}
        selectedCorridorId={selectedCorridorId}
        onSelectCorridor={setSelectedCorridorId}
        onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
        onTriggerOptimization={handleTriggerOptimization}
        hasOptimizedBlocks={optimizedBlocks.length > 0}
        approvedBlocksCount={approvedBlocksCount}
        totalTasksCount={tasks.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Navigation Sub-Header Bar */}
      <div className={`border-b sticky top-[60px] z-20 px-4 lg:px-6 transition-colors ${
        theme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="max-w-7xl ml-[124px] mr-[2px] flex items-center justify-between overflow-x-auto py-1.5 scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : (theme === 'light' 
                          ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white font-semibold')
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors shrink-0 ${
                    isActive 
                      ? 'text-slate-950' 
                      : (theme === 'light' ? 'text-slate-600 group-hover:text-slate-950' : 'text-slate-400 group-hover:text-white')
                  }`} />
                  <span className={`nav-tab-label transition-colors font-bold ${
                    isActive 
                      ? 'text-slate-950' 
                      : (theme === 'light' ? 'text-slate-800 group-hover:text-slate-950' : 'text-slate-200 group-hover:text-white')
                  }`}>
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span
                      id={`nav-badge-${tab.id}`}
                      className={`nav-tab-badge text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full border transition-none ${
                        isActive
                          ? (theme === 'light'
                              ? 'bg-white text-amber-950 border-amber-500 font-extrabold shadow-xs'
                              : 'bg-slate-950 text-amber-300 border-slate-900 font-bold')
                          : (theme === 'light'
                              ? (tab.id === 'tasks' ? 'bg-slate-200 text-slate-900 border-slate-400 font-bold shadow-xs'
                                : tab.id === 'engine' ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold'
                                : tab.id === 'review' ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold'
                                : tab.id === 'whatif' ? 'bg-purple-100 text-purple-950 border-purple-300 font-bold'
                                : tab.id === 'weekly' ? 'bg-blue-100 text-blue-950 border-blue-300 font-bold'
                                : 'bg-slate-200 text-slate-900 border-slate-400 font-bold')
                              : (tab.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'))
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            windows={windows}
            optimizedBlocks={optimizedBlocks}
            onNavigateToTab={(t) => setActiveTab(t as any)}
            onTriggerOptimization={handleTriggerOptimization}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            theme={theme}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskQueueView
            tasks={tasks}
            corridors={corridors}
            selectedCorridorId={selectedCorridorId}
            onAddTask={handleAddTask}
            isNewTaskModalOpen={isNewTaskModalOpen}
            onCloseNewTaskModal={() => setIsNewTaskModalOpen(false)}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            onTriggerOptimization={() => {
              handleTriggerOptimization();
              setActiveTab('engine');
            }}
          />
        )}

        {activeTab === 'engine' && (
          <OptimizationEngineView
            tasks={tasks}
            windows={windows}
            trains={trains}
            corridors={corridors}
            selectedCorridorId={selectedCorridorId}
            optimizedBlocks={optimizedBlocks}
            onTriggerOptimization={handleTriggerOptimization}
            onApproveBlock={handleApproveBlock}
            onApproveAllBlocks={handleApproveAllBlocks}
            onNavigateToTab={(t) => setActiveTab(t as any)}
            theme={theme}
          />
        )}

        {activeTab === 'review' && (
          <PlannerReviewView
            optimizedBlocks={optimizedBlocks}
            onApproveBlock={handleApproveBlock}
            onRejectBlock={handleRejectBlock}
            onModifyBlock={handleModifyBlock}
            corridors={corridors}
            onNavigateToTab={(t) => setActiveTab(t as any)}
          />
        )}

        {activeTab === 'whatif' && (
          <WhatIfSimulatorView
            baseTasks={tasks}
            baseWindows={windows}
            baseTrains={trains}
            corridors={corridors}
            onApplySimulatedPlan={handleApplySimulatedPlan}
            onNavigateToTab={(t) => setActiveTab(t as any)}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyScheduleView
            optimizedBlocks={optimizedBlocks}
            corridors={corridors}
            selectedCorridorId={selectedCorridorId}
            theme={theme}
          />
        )}
      </main>

      {/* Global New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
        corridors={corridors}
        theme={theme}
      />

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage.text}</span>
          </div>
        </div>
      )}


    </div>
  );
}
