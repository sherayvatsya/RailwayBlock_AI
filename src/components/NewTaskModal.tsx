import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Wrench, 
  Zap, 
  Radio, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  CheckCircle2,
  PlusCircle,
  FileText,
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
import { calculateTaskScoreAndPriority } from '../data/mockData';
import { soundFx } from '../utils/audioFx';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: MaintenanceTask) => void;
  corridors: Corridor[];
  theme?: 'dark' | 'light';
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  corridors,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [formDept, setFormDept] = useState<Department>('Engineering');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCorridorId, setFormCorridorId] = useState(corridors[0]?.id || 'COR-NDLS-CNB');
  const [formSectionName, setFormSectionName] = useState(corridors[0]?.sections[0] || 'Ghaziabad — Aligarh');
  const [formRequestedDate, setFormRequestedDate] = useState<string>('2026-09-08');
  const [formTargetWindowType, setFormTargetWindowType] = useState<
    'Night Shadow' | 'Traffic-cum-Power' | 'Integrated Jumbo' | 'Day Slot'
  >('Night Shadow');
  const [formKmStart, setFormKmStart] = useState<number>(245);
  const [formKmEnd, setFormKmEnd] = useState<number>(248);
  const [formDuration, setFormDuration] = useState<number>(150);
  const [formUrgency, setFormUrgency] = useState<UrgencyLevel>('High');
  const [formCriticality, setFormCriticality] = useState<AssetCriticality>('Very High');
  const [formOverdue, setFormOverdue] = useState<boolean>(false);
  const [formMachine, setFormMachine] = useState('');
  const [formTrafficBlock, setFormTrafficBlock] = useState(true);
  const [formPowerBlock, setFormPowerBlock] = useState(false);
  const [formDisconnection, setFormDisconnection] = useState(true);

  if (!isOpen) return null;

  // Live priority preview calculation
  const liveCalc = calculateTaskScoreAndPriority(formUrgency, formCriticality, formOverdue);

  // Quick preset templates for rapid demonstration
  const handleApplyPreset = (preset: {
    dept: Department;
    title: string;
    description: string;
    duration: number;
    urgency: UrgencyLevel;
    criticality: AssetCriticality;
    overdue: boolean;
    machine: string;
    traffic: boolean;
    power: boolean;
    disconn: boolean;
    requestedDate?: string;
    windowType?: 'Night Shadow' | 'Traffic-cum-Power' | 'Integrated Jumbo' | 'Day Slot';
  }) => {
    soundFx.playClick(650);
    setFormDept(preset.dept);
    setFormTitle(preset.title);
    setFormDescription(preset.description);
    setFormDuration(preset.duration);
    setFormUrgency(preset.urgency);
    setFormCriticality(preset.criticality);
    setFormOverdue(preset.overdue);
    setFormMachine(preset.machine);
    setFormTrafficBlock(preset.traffic);
    setFormPowerBlock(preset.power);
    setFormDisconnection(preset.disconn);
    if (preset.requestedDate) {
      setFormRequestedDate(preset.requestedDate);
    }
    if (preset.windowType) {
      setFormTargetWindowType(preset.windowType);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    soundFx.playNewTaskSound();

    const matchedCorridor = corridors.find((c) => c.id === formCorridorId);
    const corridorName = matchedCorridor ? matchedCorridor.code : 'Main Corridor';

    const newTask: MaintenanceTask = {
      id: `TSK-${formDept.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      department: formDept,
      title: formTitle,
      description: formDescription || `${formDept} maintenance work between KM ${formKmStart} and ${formKmEnd}.`,
      corridorId: formCorridorId,
      corridorName,
      sectionName: formSectionName,
      kmStart: Number(formKmStart),
      kmEnd: Number(formKmEnd),
      durationMinutes: Number(formDuration),
      urgency: formUrgency,
      assetCriticality: formCriticality,
      overdue: formOverdue,
      computedPriority: liveCalc.priority,
      computedScore: liveCalc.score,
      status: 'Pending',
      machineRequired: formMachine || undefined,
      safetyStaffRequired: 5,
      trafficBlockNeeded: formTrafficBlock,
      powerBlockNeeded: formPowerBlock,
      disconnectionNoticeNeeded: formDisconnection,
      requestedDate: formRequestedDate || '2026-09-08',
      targetWindowType: formTargetWindowType,
    };

    onAddTask(newTask);
    onClose();
  };

  const getPriorityBadge = (prio: PriorityLevel) => {
    switch (prio) {
      case 'Critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-300 border border-red-500/40">
            CRITICAL
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/40">
            MEDIUM
          </span>
        );
      case 'Low':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto transition-colors ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
          : 'bg-slate-900 border-slate-700/80 text-white ring-1 ring-slate-700'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-start justify-between border-b pb-3.5 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg border ${
                isLight 
                  ? 'bg-amber-100 text-amber-800 border-amber-300' 
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                <PlusCircle className="w-4 h-4" />
              </span>
              <h2 className={`text-base font-bold font-['Chakra_Petch'] tracking-wide ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Submit Maintenance Demand Requisition
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isLight
                  ? 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold'
                  : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
              }`}>
                Live Heuristic AI Scorer
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Submit track, traction OHE, or signalling requirements with requested working date. The engine will evaluate multi-factor priority and conflict-free timetable windows.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight 
                ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Templates */}
        <div className={`border rounded-xl p-2.5 space-y-1.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick Requisition Presets:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleApplyPreset({
                dept: 'Engineering',
                title: 'Track Tamping by CSM 09-3X Machine',
                description: 'Complete track geometry restoration and tamping between KM 245 and 248.',
                duration: 180,
                urgency: 'High',
                criticality: 'Very High',
                overdue: true,
                machine: 'CSM 09-3X Tamping Machine',
                traffic: true,
                power: false,
                disconn: true,
                requestedDate: '2026-09-08',
                windowType: 'Night Shadow',
              })}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors flex items-center gap-1 cursor-pointer font-medium ${
                isLight
                  ? 'bg-white hover:bg-blue-50 text-blue-800 border-blue-200 shadow-2xs'
                  : 'bg-slate-900 hover:bg-blue-950/50 text-blue-300 border-blue-500/30'
              }`}
            >
              <Wrench className="w-3 h-3" />
              <span>Eng: CSM Tamping (Sep 8)</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset({
                dept: 'TRD',
                title: 'OHE Catenary Dropper & Isolator Maintenance',
                description: 'Periodic inspection of 25kV traction line and insulator cleaning.',
                duration: 120,
                urgency: 'High',
                criticality: 'High',
                overdue: false,
                machine: '8-Wheeler Tower Car',
                traffic: false,
                power: true,
                disconn: false,
                requestedDate: '2026-09-08',
                windowType: 'Traffic-cum-Power',
              })}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors flex items-center gap-1 cursor-pointer font-medium ${
                isLight
                  ? 'bg-white hover:bg-amber-50 text-amber-800 border-amber-200 shadow-2xs'
                  : 'bg-slate-900 hover:bg-amber-950/50 text-amber-300 border-amber-500/30'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>TRD: OHE Wire Work (Sep 8)</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyPreset({
                dept: 'S&T',
                title: 'Axle Counter & Point Machine Overhaul',
                description: 'Signal circuit check, clamp testing, and dual axle counter tuning.',
                duration: 90,
                urgency: 'High',
                criticality: 'Very High',
                overdue: true,
                machine: '',
                traffic: true,
                power: false,
                disconn: true,
                requestedDate: '2026-09-09',
                windowType: 'Night Shadow',
              })}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors flex items-center gap-1 cursor-pointer font-medium ${
                isLight
                  ? 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                  : 'bg-slate-900 hover:bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>S&T: Point & Signal Overhaul (Sep 9)</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          {/* Department & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Department
              </label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value as Department)}
                className={`w-full rounded-lg p-2.5 focus:outline-none focus:border-amber-500 font-medium border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <option value="Engineering">Engineering (Track/Bridges)</option>
                <option value="TRD">TRD (Traction OHE)</option>
                <option value="S&T">S&T (Signals/Telecom)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Task Title / Operation
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deep Screening by BCM Machine at KM 245"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className={`w-full rounded-lg p-2.5 focus:outline-none focus:border-amber-500 border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Technical Scope & Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Provide technical particulars (speed restrictions, plant requirements, gang strength)..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className={`w-full rounded-lg p-2.5 focus:outline-none focus:border-amber-500 border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
              }`}
            />
          </div>

          {/* Corridor & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Railway Corridor
              </label>
              <select
                value={formCorridorId}
                onChange={(e) => {
                  setFormCorridorId(e.target.value);
                  const cor = corridors.find((c) => c.id === e.target.value);
                  if (cor && cor.sections.length > 0) {
                    setFormSectionName(cor.sections[0]);
                  }
                }}
                className={`w-full rounded-lg p-2.5 focus:outline-none focus:border-amber-500 font-medium border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                {corridors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Section Block Window
              </label>
              <select
                value={formSectionName}
                onChange={(e) => setFormSectionName(e.target.value)}
                className={`w-full rounded-lg p-2.5 focus:outline-none focus:border-amber-500 font-medium border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                {corridors
                  .find((c) => c.id === formCorridorId)
                  ?.sections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* DATE FOR WORKING */}
          <div className={`p-3 rounded-xl border transition-colors ${
            isLight
              ? 'bg-amber-50/60 border-amber-200'
              : 'bg-slate-950/70 border-amber-500/30'
          }`}>
            <div>
              <label className={`block font-semibold mb-1 flex items-center justify-between ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}>
                <span className="flex items-center gap-1.5">
                  <Calendar className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                  <span>Date for Working (Block Date)</span>
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-bold ${
                  isLight 
                    ? 'bg-amber-100 text-amber-900 border-amber-300' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  Required
                </span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formRequestedDate}
                  onChange={(e) => setFormRequestedDate(e.target.value)}
                  className={`w-full rounded-lg p-2.5 text-xs font-mono font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 border ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                      : 'bg-slate-950 border-slate-700 text-slate-100'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* KM Markers & Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                KM Start
              </label>
              <input
                type="number"
                value={formKmStart}
                onChange={(e) => setFormKmStart(Number(e.target.value))}
                className={`w-full rounded-lg p-2.5 font-mono focus:outline-none focus:border-amber-500 border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              />
            </div>
            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                KM End
              </label>
              <input
                type="number"
                value={formKmEnd}
                onChange={(e) => setFormKmEnd(Number(e.target.value))}
                className={`w-full rounded-lg p-2.5 font-mono focus:outline-none focus:border-amber-500 border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              />
            </div>
            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Duration (min)
              </label>
              <input
                type="number"
                step={15}
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className={`w-full rounded-lg p-2.5 font-mono focus:outline-none focus:border-amber-500 border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Urgency, Criticality, Overdue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Urgency Level
              </label>
              <select
                value={formUrgency}
                onChange={(e) => setFormUrgency(e.target.value as UrgencyLevel)}
                className={`w-full rounded-lg p-2.5 focus:outline-none focus:border-amber-500 font-medium border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <option value="High">High (Immediate)</option>
                <option value="Medium">Medium (Scheduled)</option>
                <option value="Low">Low (Routine)</option>
              </select>
            </div>

            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Asset Criticality
              </label>
              <select
                value={formCriticality}
                onChange={(e) => setFormCriticality(e.target.value as AssetCriticality)}
                className={`w-full rounded-lg p-2.5 focus:outline-none focus:border-amber-500 font-medium border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              >
                <option value="Very High">Very High (Trunk Line / Diamond Point)</option>
                <option value="High">High (High Speed Track / OHE)</option>
                <option value="Medium">Medium (Loop Line / Signal Mast)</option>
                <option value="Low">Low (Yard / Siding)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border ${
                isLight
                  ? 'bg-red-50/60 border-red-200 hover:border-red-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={formOverdue}
                  onChange={(e) => setFormOverdue(e.target.checked)}
                  className="w-4 h-4 rounded text-red-500 focus:ring-0 cursor-pointer"
                />
                <span className={`font-semibold ${isLight ? 'text-red-800' : 'text-red-300'}`}>
                  Overdue Status Flag
                </span>
              </label>
            </div>
          </div>

          {/* Machine required & Block Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Track Plant / Machine (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 09-3X CSM, OHE Tower Car, BCM"
                value={formMachine}
                onChange={(e) => setFormMachine(e.target.value)}
                className={`w-full rounded-lg p-2.5 focus:outline-none focus:border-amber-500 border ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
                }`}
              />
            </div>

            <div>
              <label className={`block font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Required Approvals
              </label>
              <div className="flex items-center gap-3 pt-2 text-[11px]">
                <label className={`flex items-center gap-1.5 cursor-pointer font-medium ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={formTrafficBlock}
                    onChange={(e) => setFormTrafficBlock(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Traffic Block</span>
                </label>
                <label className={`flex items-center gap-1.5 cursor-pointer font-medium ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={formPowerBlock}
                    onChange={(e) => setFormPowerBlock(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Power (OHE)</span>
                </label>
                <label className={`flex items-center gap-1.5 cursor-pointer font-medium ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={formDisconnection}
                    onChange={(e) => setFormDisconnection(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>S&T Disconn</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Computed Priority Banner */}
          <div className={`border rounded-xl p-3.5 flex items-center justify-between ${
            isLight
              ? 'bg-amber-50 border-amber-300 shadow-2xs'
              : 'bg-slate-950 border-amber-500/40'
          }`}>
            <div className="space-y-0.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                Live Heuristic AI Priority Scoring
              </span>
              <p className={`text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                Calculated dynamically: Urgency ({formUrgency}) + Asset ({formCriticality}) {formOverdue ? '+ Overdue Boost' : ''} • Target Date: <strong className="font-mono">{formRequestedDate}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className={`font-mono text-base font-extrabold px-3 py-1 rounded-lg border ${
                isLight
                  ? 'bg-white text-slate-950 border-slate-300 shadow-2xs'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}>
                {liveCalc.score}/100
              </span>
              {getPriorityBadge(liveCalc.priority)}
            </div>
          </div>

          {/* Modal Actions */}
          <div className={`pt-2 border-t flex justify-end gap-2.5 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <button
              id="btn-close-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
            >
              <X className="w-4 h-4 shrink-0" />
              <span>Close</span>
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Submit & Queue for AI Planning</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
