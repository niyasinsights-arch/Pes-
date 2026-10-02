import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { Match } from '../types/tournament';
import { Calendar, CheckCircle2, Clock, Edit3, UserCheck, Shield } from 'lucide-react';

export const FixturesView: React.FC = () => {
  const { rounds, getPlayerById, setActiveMatchForScore } = useTournament();
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredRounds = rounds.filter((r) => {
    if (selectedRoundFilter !== 'all' && r.roundNumber !== selectedRoundFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Filter Controls */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D] flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#2563EB]" />
              Tournament Fixtures
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              7 Rounds · 3 Matches per round · 1 BYE player per round
            </p>
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-[#172B4D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-white text-[#172B4D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-white text-[#172B4D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#172B4D]'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Round Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#E5E7EB] pt-4">
          <button
            onClick={() => setSelectedRoundFilter('all')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedRoundFilter === 'all'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#172B4D] border border-[#E5E7EB] hover:bg-slate-50'
            }`}
          >
            All 7 Rounds
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map((rNum) => {
            const isSelected = selectedRoundFilter === rNum;
            const roundData = rounds.find((r) => r.roundNumber === rNum);
            const completedCount = roundData?.matches.filter((m) => m.isCompleted).length ?? 0;

            return (
              <button
                key={rNum}
                onClick={() => setSelectedRoundFilter(rNum)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#64748B] hover:text-[#172B4D] border border-[#E5E7EB] hover:bg-slate-50'
                }`}
              >
                <span>Round {rNum}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-numbers ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-[#64748B]'
                  }`}
                >
                  {completedCount}/3
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rounds List */}
      <div className="space-y-6">
        {filteredRounds.map((round) => {
          const byePlayer = getPlayerById(round.byePlayerId);
          const roundMatches = round.matches.filter((m) => {
            if (statusFilter === 'pending') return !m.isCompleted;
            if (statusFilter === 'completed') return m.isCompleted;
            return true;
          });

          // If filtering hid all matches in this round and no BYE matches
          if (roundMatches.length === 0 && statusFilter !== 'all') {
            return null;
          }

          return (
            <div
              key={round.roundNumber}
              className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs"
            >
              {/* Round Header Bar */}
              <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    R{round.roundNumber}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-[#172B4D] tracking-tight">
                      ROUND {round.roundNumber}
                    </h3>
                    <p className="text-xs text-[#64748B]">3 Matches scheduled</p>
                  </div>
                </div>

                {/* BYE Player display */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#172B4D] shadow-2xs">
                  <UserCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>
                    BYE: <strong className="text-[#172B4D] font-bold">{byePlayer.name}</strong>
                  </span>
                </div>
              </div>

              {/* Matches list in Round */}
              <div className="p-4 sm:p-6 divide-y divide-[#E5E7EB]">
                {roundMatches.length === 0 ? (
                  <div className="py-6 text-center text-sm text-[#64748B]">
                    No matches matching current filter in Round {round.roundNumber}.
                  </div>
                ) : (
                  roundMatches.map((match: Match) => {
                    const p1 = getPlayerById(match.player1Id);
                    const p2 = getPlayerById(match.player2Id);
                    const isCompleted = match.isCompleted;
                    const p1Score = match.player1Score;
                    const p2Score = match.player2Score;

                    const p1Won = isCompleted && (p1Score ?? 0) > (p2Score ?? 0);
                    const p2Won = isCompleted && (p2Score ?? 0) > (p1Score ?? 0);
                    const isDraw = isCompleted && p1Score !== null && p1Score === p2Score;

                    return (
                      <div
                        key={match.id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Match Content */}
                        <div className="flex-1 grid grid-cols-12 items-center gap-2 sm:gap-4">
                          {/* Match Index Tag */}
                          <div className="col-span-12 sm:col-span-2 flex items-center gap-2 text-xs font-medium text-[#64748B]">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-mono font-semibold">
                              M{match.matchIndex}
                            </span>
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]">
                                <CheckCircle2 className="w-3 h-3" /> FT
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                                <Clock className="w-3 h-3" /> PENDING
                              </span>
                            )}
                          </div>

                          {/* Player 1 */}
                          <div className="col-span-5 sm:col-span-4 flex items-center justify-end gap-2 text-right">
                            <span
                              className={`text-sm sm:text-base font-bold truncate ${
                                p1Won
                                  ? 'text-[#172B4D] font-extrabold'
                                  : isCompleted
                                  ? 'text-[#64748B]'
                                  : 'text-[#172B4D]'
                              }`}
                            >
                              {p1.name}
                            </span>
                            <div className="w-7 h-7 shrink-0 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold flex items-center justify-center">
                              {p1.id}
                            </div>
                          </div>

                          {/* Score Board Box */}
                          <div className="col-span-2 sm:col-span-2 flex items-center justify-center">
                            {isCompleted ? (
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg shadow-2xs">
                                <span
                                  className={`text-base sm:text-lg font-mono font-bold tabular-nums ${
                                    p1Won ? 'text-[#16A34A]' : 'text-[#172B4D]'
                                  }`}
                                >
                                  {p1Score}
                                </span>
                                <span className="text-xs text-[#64748B] font-bold">-</span>
                                <span
                                  className={`text-base sm:text-lg font-mono font-bold tabular-nums ${
                                    p2Won ? 'text-[#16A34A]' : 'text-[#172B4D]'
                                  }`}
                                >
                                  {p2Score}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-[#64748B] bg-slate-100 border border-[#E5E7EB] px-2.5 py-1 rounded">
                                VS
                              </span>
                            )}
                          </div>

                          {/* Player 2 */}
                          <div className="col-span-5 sm:col-span-4 flex items-center justify-start gap-2 text-left">
                            <div className="w-7 h-7 shrink-0 rounded-full bg-slate-100 border border-slate-200 text-[#172B4D] text-xs font-bold flex items-center justify-center">
                              {p2.id}
                            </div>
                            <span
                              className={`text-sm sm:text-base font-bold truncate ${
                                p2Won
                                  ? 'text-[#172B4D] font-extrabold'
                                  : isCompleted
                                  ? 'text-[#64748B]'
                                  : 'text-[#172B4D]'
                              }`}
                            >
                              {p2.name}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0 flex items-center justify-end pt-2 md:pt-0">
                          {isCompleted ? (
                            <button
                              onClick={() => setActiveMatchForScore(match)}
                              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#172B4D] bg-white hover:bg-slate-50 border border-[#E5E7EB] rounded-xl transition-all shadow-2xs cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#64748B]" />
                              <span>Edit Score</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setActiveMatchForScore(match)}
                              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs cursor-pointer"
                            >
                              <span>ENTER SCORE</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
