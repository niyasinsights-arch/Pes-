import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { NavTab } from '../types/tournament';
import { Trophy, Calendar, Table, Users, RotateCcw, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, setIsResetModalOpen, stats, toastMessage } = useTournament();

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'fixtures', label: 'Fixtures', icon: Calendar },
    { id: 'table', label: 'Points Table', icon: Table },
    { id: 'players', label: 'Players', icon: Users },
  ];

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-[#16A34A] text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B4D]">
                  PES TOURNAMENT 2026
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                7 Players · 21 Matches · Single Round Robin
              </p>
            </div>
          </div>

          {/* Header Action: Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-red-600 bg-white hover:bg-red-50 border border-[#E5E7EB] hover:border-red-200 rounded-lg transition-colors cursor-pointer"
              title="Reset tournament"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* 4 Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none border-t border-[#E5E7EB] pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/40'
                    : 'border-transparent text-[#64748B] hover:text-[#172B4D] hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
                {item.id === 'fixtures' && stats.remainingMatches > 0 && (
                  <span className="text-[11px] font-bold tabular-numbers px-1.5 py-0.5 rounded-full bg-slate-100 text-[#64748B]">
                    {stats.completedMatches}/{stats.totalMatches}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
