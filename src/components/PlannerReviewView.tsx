import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  UserCheck, 
  Layers, 
  Wrench, 
  Zap, 
  Radio, 
  Sparkles,
  AlertTriangle,
  X,
  Check
} from 'lucide-react';
import { OptimizedBlock, MaintenanceTask, Corridor } from '../types';
import { soundFx } from '../utils/audioFx';

interface PlannerReviewViewProps {
  optimizedBlocks: OptimizedBlock[];
  onApproveBlock: (blockId: string, notes?: string) => void;
  onRejectBlock: (blockId: string, reason?: string) => void;
  onModifyBlock: (updatedBlock: OptimizedBlock) => void;
  corridors: Corridor[];
  onNavigateToTab: (tab: string) => void;
}

export const PlannerReviewView: React.FC<PlannerReviewViewProps> = ({
  optimizedBlocks,
  onApproveBlock,
  onRejectBlock,
  onModifyBlock,
  corridors,
  onNavigateToTab,
}) => {
  const [editingBlock, setEditingBlock] = useState<OptimizedBlock | null>(null);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'Awaiting Review' | 'Approved' | 'Rejected'>('ALL');

  const pendingBlocks = optimizedBlocks.filter((b) => b.status === 'Awaiting Review');
  const approvedBlocks = optimizedBlocks.filter((b) => b.status === 'Approved');

  const filteredBlocks = reviewFilter === 'ALL'
    ? optimizedBlocks
    : optimizedBlocks.filter((b) => b.status === reviewFilter);

  const handleApproveWithEffect = (blockId: string) => {
    soundFx.playSanctionSound();
    onApproveBlock(blockId, 'Sanctioned by Divisional Chief Controller (Operating)');
  };

  const handleOpenEdit = (block: OptimizedBlock) => {
    soundFx.playClick();
    setEditingBlock(block);
    setEditStartTime(block.startTime);
    setEditEndTime(block.endTime);
    setEditNotes(block.plannerNotes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;

    soundFx.playClick(600);
    const updated: OptimizedBlock = {
      ...editingBlock,
      startTime: editStartTime,
      endTime: editEndTime,
      plannerNotes: editNotes,
      status: 'Modified',
    };

    onModifyBlock(updated);
    setEditingBlock(null);
  };

  const getDeptBadge = (dept: string) => {
    switch (dept) {
      case 'Engineering':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Wrench className="w-3 h-3 text-blue-400" />
            Eng
          </span>
        );
      case 'TRD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Zap className="w-3 h-3 text-amber-400" />
            TRD
          </span>
        );
      case 'S&T':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Radio className="w-3 h-3 text-emerald-400" />
            S&T
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner explaining Human-In-The-Loop */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                Human-in-the-Loop Architecture
              </span>
              <h1 className="text-base font-bold text-white font-['Chakra_Petch']">
                Chief Controller & Block Planner Sanction Console
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              The AI planning layer generates candidate multi-department plans, but full executive authority rests with the human controller to inspect, fine-tune, or authorize block sanctions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                pendingBlocks.forEach((b) => handleApproveWithEffect(b.id));
              }}
              disabled={pendingBlocks.length === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pendingBlocks.length === 0
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Approve All Pending ({pendingBlocks.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 text-[11px]">Filter Review State:</span>
          {(['ALL', 'Awaiting Review', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setReviewFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                reviewFilter === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {st} {st === 'Awaiting Review' ? `(${pendingBlocks.length})` : st === 'Approved' ? `(${approvedBlocks.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* List of Optimized Blocks Awaiting / Under Review */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No blocks found in this view</p>
            <p className="text-xs text-slate-500 mt-1">Run the AI Optimizer or change the filter.</p>
          </div>
        ) : (
          filteredBlocks.map((block) => {
            const isPending = block.status === 'Awaiting Review';
            const isApproved = block.status === 'Approved';
            const isRejected = block.status === 'Rejected';

            return (
              <div
                key={block.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 space-y-4 transition-all ${
                  isApproved
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : isRejected
                    ? 'border-red-500/40 bg-red-950/10'
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                {/* Block Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-amber-400">
                        {block.blockCode}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                        {block.windowType}
                      </span>
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <Check className="w-3 h-3" />
                          Sanctioned & Approved
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                          <X className="w-3 h-3" />
                          Rejected / Revoked
                        </span>
                      )}
                      {block.status === 'Modified' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                          <Edit3 className="w-3 h-3" />
                          Planner Modified
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {block.corridorName} — Section: <span className="text-amber-300">{block.sectionName}</span>
                    </h3>
                  </div>

                  {/* Actions (Approve / Modify / Reject) */}
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(block)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Modify Window</span>
                        </button>
                        <button
                          onClick={() => onRejectBlock(block.id, 'Train congestion risk')}
                          className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-800/60 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleApproveWithEffect(block.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>Approve Block</span>
                        </button>
                      </>
                    )}
                    {isApproved && (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Ready in Confirmed Master Schedule</span>
                      </div>
                    )}
                    {isRejected && (
                      <button
                        onClick={() => onApproveBlock(block.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Re-instate Block
                      </button>
                    )}
                  </div>
                </div>

                {/* Key Block Parameters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Scheduled Time Window</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {block.startTime} — {block.endTime}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Date: {block.date} ({block.durationMinutes} min)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Track Span & Line</span>
                    <span className="font-mono font-bold text-amber-300">
                      {block.kmRange}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Line: {block.line}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Joint Coordinated Tasks</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {block.tasks.length} Tasks Bundled
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Eng: {block.departmentCounts.engineering} • TRD: {block.departmentCounts.trd} • S&T: {block.departmentCounts.st}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Track Capacity Saved</span>
                    <span className="font-mono font-bold text-amber-400">
                      +{block.coordinationGain.timeSavedHours} Hours
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      {block.coordinationGain.efficiencyGainPercent}% Downtime Reduction
                    </span>
                  </div>
                </div>

                {/* Coordinated Tasks Breakdown */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                    Tasks Included in This Approved Block Window:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {block.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-300">{task.id}</span>
                          {getDeptBadge(task.department)}
                        </div>
                        <div className="font-semibold text-slate-200 text-[11px] line-clamp-1">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
                          <span>KM {task.kmStart}-{task.kmEnd}</span>
                          <span>{task.durationMinutes}m duration</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Planner Notes if any */}
                {block.plannerNotes && (
                  <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400">
                    <span className="font-semibold text-amber-300">Planner Remarks:</span> {block.plannerNotes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modify Block Modal */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  Modify Block Window: {editingBlock.blockCode}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust authorized times or attach controller instructions.
                </p>
              </div>
              <button
                onClick={() => setEditingBlock(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Operating Controller Remarks</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Ensure OHE power cutoff confirmed with TPC before granting track machine entry..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
