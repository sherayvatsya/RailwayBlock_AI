export type Department = 'Engineering' | 'TRD' | 'S&T';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type UrgencyLevel = 'Low' | 'Medium' | 'High';

export type AssetCriticality = 'Low' | 'Medium' | 'High' | 'Very High';

export interface MaintenanceTask {
  id: string;
  department: Department;
  title: string;
  description: string;
  corridorId: string;
  corridorName: string;
  sectionName: string;
  kmStart: number;
  kmEnd: number;
  durationMinutes: number;
  urgency: UrgencyLevel;
  assetCriticality: AssetCriticality;
  overdue: boolean;
  computedPriority: PriorityLevel;
  computedScore: number;
  status: 'Pending' | 'Planned' | 'Approved' | 'In Progress' | 'Completed';
  plannedBlockId?: string;
  machineRequired?: string;
  safetyStaffRequired: number;
  trafficBlockNeeded: boolean;
  powerBlockNeeded: boolean; // OHE power cutoff required
  disconnectionNoticeNeeded: boolean; // S&T disconnection
  requestedDate: string;
  targetWindowType?: 'Night Shadow' | 'Traffic-cum-Power' | 'Integrated Jumbo' | 'Day Slot';
}

export interface Corridor {
  id: string;
  code: string;
  name: string;
  zone: string; // e.g., 'Northern Railway (NR)', 'South Central Railway (SCR)'
  division: string;
  kmLength: number;
  sections: string[];
  trackType: 'Double Line' | 'Quadruple Line' | '3rd Line Added' | 'Double / Triple Line' | 'Single / Double Line' | 'Double Line (160 kmph Semi-High Speed)' | string;
  electrification: '25 kV AC OHE' | '2x25 kV AC Auto-transformer' | string;
}

export interface BlockWindow {
  id: string;
  corridorId: string;
  sectionName: string;
  date: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  durationMinutes: number;
  kmStart: number;
  kmEnd: number;
  line: 'UP Line' | 'DOWN Line' | 'BOTH / JUMBO' | 'Single Line';
  isAvailable: boolean;
  blackoutReason?: string;
  capacityType: 'Standard Night Window' | 'Shadow Block' | 'Major Sunday Corridor Block' | string;
}

export interface TrainSchedule {
  id: string;
  trainNo: string;
  trainName: string;
  trainType: 'Vande Bharat' | 'Rajdhani / Shatabdi' | 'Express / Mail' | 'Freight / Goods' | 'Suburban EMU';
  corridorId: string;
  sectionName: string;
  line: 'UP Line' | 'DOWN Line';
  scheduledDate: string;
  passStartTime: string; // "HH:MM"
  passEndTime: string;   // "HH:MM"
  priorityTier: number;  // 1 (Highest, e.g. Vande Bharat) to 4 (Freight)
}

export interface OptimizedBlock {
  id: string;
  blockCode: string;
  corridorId: string;
  corridorName: string;
  sectionName: string;
  kmStart: number;
  kmEnd: number;
  kmRange: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  line: 'UP Line' | 'DOWN Line' | 'BOTH / JUMBO' | 'Single Line';
  windowType: 'Integrated Jumbo Block' | 'Traffic-cum-Power Block' | 'Shadow Block' | 'Corridor Window';
  tasks: MaintenanceTask[];
  departmentCounts: {
    engineering: number;
    trd: number;
    st: number;
  };
  coordinationGain: {
    independentBlocksCount: number;
    independentTotalHours: number;
    optimizedHours: number;
    timeSavedHours: number;
    efficiencyGainPercent: number;
    punctualityRisk: 'Zero Conflict' | 'Minor Shadow' | 'Controlled Caution';
  };
  trainConflictsChecked: number;
  trainConflictsResolved: number;
  status: 'Awaiting Review' | 'Approved' | 'Modified' | 'Rejected';
  windowSlotId: string;
  assignedResources: string[];
  plannerNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface SimulationResult {
  scenarioName: string;
  description: string;
  deltaSummary: {
    blocksCountBefore: number;
    blocksCountAfter: number;
    hoursSavedBefore: number;
    hoursSavedAfter: number;
    affectedTasksCount: number;
    resolutionNotes: string;
  };
  newOptimizedBlocks: OptimizedBlock[];
}
