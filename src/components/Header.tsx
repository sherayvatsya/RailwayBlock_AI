import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Cpu, 
  Sparkles, 
  Layers, 
  Radio, 
  Plus, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon 
} from 'lucide-react';
import { Corridor } from '../types';
import { soundFx } from '../utils/audioFx';

interface HeaderProps {
  corridors: Corridor[];
  selectedCorridorId: string;
  onSelectCorridor: (id: string) => void;
  onOpenNewTaskModal: () => void;
  onTriggerOptimization: () => void;
  hasOptimizedBlocks: boolean;
  approvedBlocksCount: number;
  totalTasksCount: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  corridors,
  selectedCorridorId,
  onSelectCorridor,
  onOpenNewTaskModal,
  onTriggerOptimization,
  hasOptimizedBlocks,
  approvedBlocksCount,
  totalTasksCount,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format Indian Standard Time (IST)
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      };
      setTime(now.toLocaleTimeString('en-IN', options) + ' IST');
      
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      };
      setDateStr(now.toLocaleDateString('en-IN', dateOptions));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Brand / Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-orange-500/25 ring-1 ring-amber-400/50 shrink-0">
            <Train className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            {/* Top Line: RailBlock AI strictly in the same line */}
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight font-['Chakra_Petch'] leading-tight whitespace-nowrap flex items-center gap-1.5">
                <span className={theme === 'light' ? 'text-slate-950 font-bold' : 'text-white font-bold'}>RailBlock</span>
                <span className="bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-black">AI</span>
              </h1>
            </div>

            {/* Bottom Line: Indian Railways Decision Support below RailBlock AI */}
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border whitespace-nowrap shrink-0 transition-colors ${
                theme === 'light'
                  ? 'bg-blue-50 border-blue-300 text-blue-950 shadow-2xs'
                  : 'bg-slate-800 border-slate-600 text-slate-100'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                <span className={`font-bold ${theme === 'light' ? 'text-blue-950' : 'text-slate-100'}`}>
                  Indian Railways Decision Support
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Center & Right Control Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Corridor Filter Select */}
          <div className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 text-xs ${
            theme === 'light' 
              ? 'bg-white border-slate-300 text-slate-900 shadow-xs' 
              : 'bg-slate-950/70 border-slate-800 text-slate-300'
          }`}>
            <Layers className={`w-3.5 h-3.5 shrink-0 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} />
            <span className="text-slate-500 hidden sm:inline">Corridor:</span>
            <select
              value={selectedCorridorId}
              onChange={(e) => onSelectCorridor(e.target.value)}
              className={`bg-transparent font-semibold focus:outline-none cursor-pointer text-xs ${
                theme === 'light' ? 'text-slate-900' : 'text-slate-200'
              }`}
            >
              <option value="ALL" className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-200'}>
                All Corridors ({corridors.length} HDN/Trunk Routes)
              </option>
              {corridors.map((c) => (
                <option key={c.id} value={c.id} className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-200'}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Live Control Room Clock */}
          <div className={`hidden lg:flex items-center gap-2 border rounded-lg px-3 py-1.5 font-mono text-xs ${
            theme === 'light'
              ? 'bg-white border-slate-300 text-slate-900 shadow-xs'
              : 'bg-slate-950/80 border-slate-800/80 text-slate-300'
          }`}>
            <Radio className={`w-3.5 h-3.5 animate-pulse ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`} />
            <div>
              <span className={`font-bold ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-400'}`}>{time}</span>
              <span className="text-slate-500 ml-1.5 text-[10px]">{dateStr}</span>
            </div>
          </div>

          {/* Sound FX Audio Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
              !isMuted 
                ? (theme === 'light' ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200' : 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25') 
                : (theme === 'light' ? 'bg-white border-slate-300 text-slate-500 hover:text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:text-slate-300')
            }`}
            title={isMuted ? 'Unmute Audio & Feature Sound Effects' : 'Mute Sound Effects'}
          >
            {!isMuted ? (
              <Volume2 className={`w-4 h-4 ${theme === 'light' ? 'text-amber-800' : 'text-amber-400'}`} />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Dark / Light (White) Mode Toggle Button */}
          <button
            onClick={() => {
              soundFx.playClick(theme === 'light' ? 520 : 780);
              onToggleTheme?.();
            }}
            className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
              theme === 'light'
                ? 'bg-amber-100 border-amber-400 text-slate-900 hover:bg-amber-200 shadow-xs'
                : 'bg-slate-800/90 border-slate-700 text-amber-300 hover:bg-slate-700 hover:text-amber-200'
            }`}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to White (Light) Mode'}
            aria-label="Toggle Dark or White Mode"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-900" />
                <span className="hidden sm:inline text-slate-900 font-bold">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-slate-200 font-medium">White Mode</span>
              </>
            )}
          </button>

          {/* Quick Action CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenNewTaskModal();
              }}
              className={`px-3.5 py-1.5 rounded-lg active:scale-95 text-xs font-bold border shadow-xs transition-all flex items-center gap-1.5 cursor-pointer group ${
                theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-amber-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700/80 hover:border-amber-500/50'
              }`}
              title="Add a maintenance requirement from Engineering, TRD, or S&T"
            >
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                <Plus className="w-3 h-3" />
              </span>
              <span className="font-semibold">New Task</span>
            </button>

            <button
              onClick={() => {
                soundFx.playOptimizationPlanSuccess();
                onTriggerOptimization();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Cpu className="w-3.5 h-3.5 text-slate-950" />
              <span className="text-slate-950 font-bold">Run AI Optimizer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
