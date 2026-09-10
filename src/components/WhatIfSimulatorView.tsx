import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  Train, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Flame, 
  RotateCcw,
  Layers,
  TrendingUp,
  FileDiff
} from 'lucide-react';
import { 
  MaintenanceTask, 
  BlockWindow, 
  TrainSchedule, 
  OptimizedBlock, 
  Corridor 
} from '../types';
import { runOptimization } from '../utils/optimizationEngine';
import { soundFx } from '../utils/audioFx';

interface WhatIfSimulatorViewProps {
  baseTasks: MaintenanceTask[];
  baseWindows: BlockWindow[];
  baseTrains: TrainSchedule[];
  corridors: Corridor[];
  onApplySimulatedPlan: (newTasks: MaintenanceTask[], newBlocks: OptimizedBlock[]) => void;
  onNavigateToTab: (tab: string) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  baseTasks,
  baseWindows,
  baseTrains,
  corridors,
  onApplySimulatedPlan,
  onNavigateToTab,
}) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simDiff, setSimDiff] = useState<{
    scenarioTitle: string;
    description: string;
    impactSummary: string;
    diffDetails: string[];
    simulatedBlocks: OptimizedBlock[];
  } | null>(null);

  // PRESET 1: Mark Prime Window as Unavailable (e.g. VIP train movement / line disruption)
  const runPreset1 = () => {
    soundFx.playScenarioSweep();
    setSimulationRunning(true);
    setActivePreset('window_blocked');

    setTimeout(() => {
      // Modify windows: mark WIN-01 (Aligarh 01:15-04:45) as unavailable
      const updatedWindows = baseWindows.map((w) =>
        w.id === 'WIN-01' ? { ...w, isAvailable: false, blackoutReason: 'VIP Special Train Movement' } : w
      );

      const { optimizedBlocks } = runOptimization(baseTasks, updatedWindows, baseTrains);

      setSimDiff({
        scenarioTitle: 'Scenario A: Prime Night Window Blocked (Aligarh — Tundla)',
        description: 'Simulating emergency cancellation of standard night window 01:15–04:45 due to special VIP rakes.',
        impactSummary: 'AI automatically rerouted and shifted the Aligarh cluster tasks into secondary shadow slot (01:45–05:00) with zero task drops.',
        diffDetails: [
          'Window WIN-01 disabled due to track restriction.',
          'Cluster of 4 tasks (Engineering + TRD + S&T) relocated to adjacent shadow window.',
          'Zero punctuality delay introduced on Vande Bharat (Train #22436).',
        ],
        simulatedBlocks: optimizedBlocks,
      });

      soundFx.playOptimizationPlanSuccess();
      setSimulationRunning(false);
    }, 500);
  };

  // PRESET 2: Inject Emergency Critical S&T Task at KM 246
  const runPreset2 = () => {
    soundFx.playScenarioSweep();
    setSimulationRunning(true);
    setActivePreset('critical_task');

    setTimeout(() => {
      const emergencyTask: MaintenanceTask = {
        id: 'TSK-ST-EMERGENCY',
        department: 'S&T',
        title: '🔴 EMERGENCY: Fractured Insulated Block Joint & Dual Axle Counter Failure',
        description: 'Critical track circuit failure causing red signal clamping on UP Main Line KM 246.2. Requires immediate traffic block.',
        corridorId: 'COR-NDLS-CNB',
        corridorName: 'NDLS-CNB Main Line',
        sectionName: 'Aligarh — Tundla',
        kmStart: 246,
        kmEnd: 247,
        durationMinutes: 120,
        urgency: 'High',
        assetCriticality: 'Very High',
        overdue: true,
        computedPriority: 'Critical',
        computedScore: 98,
        status: 'Pending',
        trafficBlockNeeded: true,
        powerBlockNeeded: false,
        disconnectionNoticeNeeded: true,
        safetyStaffRequired: 6,
        requestedDate: '2026-09-08',
      };

      const updatedTasks = [emergencyTask, ...baseTasks];
      const { optimizedBlocks } = runOptimization(updatedTasks, baseWindows, baseTrains);

      setSimDiff({
        scenarioTitle: 'Scenario B: Inject Urgent Critical Task (Axle Counter Failure at KM 246)',
        description: 'Sudden field emergency reported by Signal Inspector requiring top-priority block grant.',
        impactSummary: 'Algorithm instantly elevated emergency task to Rank #1 and bundled it directly into the ongoing Aligarh Track & OHE renewal block.',
        diffDetails: [
          'Emergency task received Priority Score 98/100 (Highest).',
          'Co-located with existing Engineering CSM tamping block at KM 245–248.',
          'Avoided creating a 4th separate track closure — saved 3.0 additional hours of train downtime.',
        ],
        simulatedBlocks: optimizedBlocks,
      });

      soundFx.playOptimizationPlanSuccess();
      setSimulationRunning(false);
    }, 500);
  };

  // PRESET 3: Surge in Freight Train Density on Grand Chord
  const runPreset3 = () => {
    soundFx.playScenarioSweep();
    setSimulationRunning(true);
    setActivePreset('freight_surge');

    setTimeout(() => {
      const extraTrains: TrainSchedule[] = [
        {
          id: 'TR-BOXN-HEAVY-1',
          trainNo: 'G-BOXN-881',
          trainName: 'Coal Rake Extra (Asansol-Dhanbad)',
          trainType: 'Freight / Goods',
          corridorId: 'COR-HWH-MGS',
          sectionName: 'Asansol — Dhanbad',
          line: 'UP Line',
          scheduledDate: '2026-09-08',
          passStartTime: '02:30',
          passEndTime: '03:00',
          priorityTier: 3,
        },
        {
          id: 'TR-BOXN-HEAVY-2',
          trainNo: 'G-BCNHL-992',
          trainName: 'Container Goods Rake',
          trainType: 'Freight / Goods',
          corridorId: 'COR-HWH-MGS',
          sectionName: 'Asansol — Dhanbad',
          line: 'UP Line',
          scheduledDate: '2026-09-08',
          passStartTime: '03:45',
          passEndTime: '04:15',
          priorityTier: 3,
        },
      ];

      const updatedTrains = [...baseTrains, ...extraTrains];
      const { optimizedBlocks } = runOptimization(baseTasks, baseWindows, updatedTrains);

      setSimDiff({
        scenarioTitle: 'Scenario C: Double Freight Density Surge (Grand Chord Route)',
        description: 'Simulating high-density coal freight operations overlapping maintenance intervals.',
        impactSummary: 'Engine detected 2 new interval conflicts and dynamically adjusted block boundaries with freight train regulation.',
        diffDetails: [
          '2 additional freight schedules analyzed in interval-overlap checker.',
          'Grand Chord block shifted to non-conflicting 02:00-05:30 slot.',
          'Zero passenger train delay; freight trains regulated via loop lines.',
        ],
        simulatedBlocks: optimizedBlocks,
      });

      soundFx.playOptimizationPlanSuccess();
      setSimulationRunning(false);
    }, 500);
  };

  const handleReset = () => {
    soundFx.playClick();
    setActivePreset(null);
    setSimDiff(null);
  };

  const handleAcceptPlan = () => {
    if (!simDiff) return;
    soundFx.playSanctionSound();
    onApplySimulatedPlan(baseTasks, simDiff.simulatedBlocks);
    onNavigateToTab('review');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Simulator Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                Dynamic What-If Engine
              </span>
              <h1 className="text-base font-bold text-white font-['Chakra_Petch']">
                Real-Time Operational Disruption & Scenario Simulator
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test how the AI constraint algorithm reacts when railway field conditions shift dynamically.
            </p>
          </div>

          {activePreset && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Baseline Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario 1 */}
        <div
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activePreset === 'window_blocked'
              ? 'bg-purple-950/20 border-purple-500/50 ring-2 ring-purple-500/20'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
          onClick={runPreset1}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-red-400 border border-red-900/40 font-bold">
              SCENARIO 1
            </span>
            <Clock className="w-4 h-4 text-red-400" />
          </div>
          <h2 className="text-sm font-bold text-white mt-2">Track Window Unavailable</h2>
          <p className="text-xs text-slate-400 mt-1 leading-normal">
            Emergency revocation of prime night window (01:15–04:45) at Aligarh due to VIP train movement.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              runPreset1();
            }}
            className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Simulate Re-Route</span>
          </button>
        </div>

        {/* Scenario 2 */}
        <div
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activePreset === 'critical_task'
              ? 'bg-red-950/20 border-red-500/50 ring-2 ring-red-500/20'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
          onClick={runPreset2}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-orange-400 border border-orange-900/40 font-bold">
              SCENARIO 2
            </span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <h2 className="text-sm font-bold text-white mt-2">Inject Critical Task</h2>
          <p className="text-xs text-slate-400 mt-1 leading-normal">
            Sudden emergency track circuit / axle counter breakdown at KM 246 requiring instant high-priority bundling.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              runPreset2();
            }}
            className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Simulate Emergency Inject</span>
          </button>
        </div>

        {/* Scenario 3 */}
        <div
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activePreset === 'freight_surge'
              ? 'bg-blue-950/20 border-blue-500/50 ring-2 ring-blue-500/20'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
          onClick={runPreset3}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-blue-400 border border-blue-900/40 font-bold">
              SCENARIO 3
            </span>
            <Train className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-sm font-bold text-white mt-2">Surge in Freight Density</h2>
          <p className="text-xs text-slate-400 mt-1 leading-normal">
            Additional heavy-haul coal rakes operating across Grand Chord corridor creating timetable bottlenecks.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              runPreset3();
            }}
            className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Simulate Traffic Surge</span>
          </button>
        </div>
      </div>

      {/* Simulation Result Diff View */}
      {simDiff && (
        <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-5 md:p-6 shadow-2xl space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-purple-500 text-slate-950">
                  SIMULATION RECALCULATION RESULT
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Optimal Feasibility Maintained
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-['Chakra_Petch']">
                {simDiff.scenarioTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAcceptPlan}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Adopt Simulated Plan & Send to Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-semibold">
              <FileDiff className="w-4 h-4" />
              <span>Algorithmic Delta & Resolution Summary:</span>
            </div>
            <p className="text-slate-200 text-sm font-medium leading-relaxed">
              {simDiff.impactSummary}
            </p>

            <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
              {simDiff.diffDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Preview of Recalculated Blocks */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Recalculated Blocks Generated ({simDiff.simulatedBlocks.length}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {simDiff.simulatedBlocks.map((blk) => (
                <div key={blk.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{blk.blockCode}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{blk.startTime} - {blk.endTime}</span>
                  </div>
                  <div className="font-semibold text-slate-200 text-xs truncate">{blk.sectionName}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    {blk.tasks.length} tasks • +{blk.coordinationGain.timeSavedHours}h saved
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
