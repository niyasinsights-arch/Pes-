import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { Match, PlayerStanding } from '../types/tournament';
import {
  Users,
  Trophy,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    stats,
    matches,
    standings,
    setActiveTab,
    setActiveMatchForScore,
    getPlayerById,
  } = useTournament();

  // Find next pending match
  const nextPendingMatch: Match | undefined = matches.find((m) => !m.isCompleted);

  // Find recent completed matches (last 3 completed)
  const recentCompletedMatches: Match[] = matches
    .filter((m) => m.isCompleted)
    .slice(-3)
    .reverse();

  const topThree = standings.slice(0, 3);
  const isTournamentFinished = stats.completedMatches === stats.totalMatches;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              Official Tournament Manager
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
              PES TOURNAMENT 2026
            </h2>
            <p className="text-sm sm:text-base text-[#64748B]">
              7 Players · 21 Matches · Single Round Robin Format
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('fixtures')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>View Fixtures</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-[#172B4D] bg-white hover:bg-slate-50 active:bg-slate-100 border border-[#E5E7EB] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>Points Table</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tournament Progress Bar */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
            <span className="text-[#172B4D] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              Tournament Progress
            </span>
            <span className="text-[#64748B] font-mono tabular-nums">
              {stats.completedMatches} of {stats.totalMatches} matches played ({stats.progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-[#E5E7EB]/60">
            <div
              className="h-full bg-gradient-to-r from-[#2563EB] to-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Players</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#2563EB]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#172B4D] font-mono tabular-nums">
              {stats.totalPlayers}
            </div>
            <div className="text-xs text-[#64748B] mt-1 font-medium">All registered & active</div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Matches</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#172B4D]">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#172B4D] font-mono tabular-nums">
              {stats.totalMatches}
            </div>
            <div className="text-xs text-[#64748B] mt-1 font-medium">Across 7 rounds</div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Matches</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#16A34A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#16A34A] font-mono tabular-nums">
              {stats.completedMatches}
            </div>
            <div className="text-xs text-[#64748B] mt-1 font-medium">Results finalized</div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Remaining Matches</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#172B4D] font-mono tabular-nums">
              {stats.remainingMatches}
            </div>
            <div className="text-xs text-[#64748B] mt-1 font-medium">Awaiting score entry</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Next Match Callout & Leaderboard Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Match / Action Area (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Next Match Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                {isTournamentFinished ? 'Tournament Completed!' : 'Next Pending Match'}
              </h3>
              {nextPendingMatch && (
                <span className="text-xs font-bold text-[#64748B] bg-slate-100 px-2.5 py-1 rounded-md">
                  Round {nextPendingMatch.round} · Match {nextPendingMatch.matchIndex}
                </span>
              )}
            </div>

            {nextPendingMatch ? (
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 text-center">
                  {/* Player 1 */}
                  <div className="flex-1 space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-[#2563EB] font-bold text-lg flex items-center justify-center shadow-xs">
                      {getPlayerById(nextPendingMatch.player1Id).name.charAt(0)}
                    </div>
                    <div className="font-bold text-base sm:text-lg text-[#172B4D] truncate">
                      {getPlayerById(nextPendingMatch.player1Id).name}
                    </div>
                    <div className="text-xs text-[#64748B]">Player #{nextPendingMatch.player1Id}</div>
                  </div>

                  {/* VS Indicator */}
                  <div className="shrink-0 px-3">
                    <span className="inline-block text-xs font-extrabold text-[#64748B] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full shadow-2xs">
                      VS
                    </span>
                  </div>

                  {/* Player 2 */}
                  <div className="flex-1 space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-[#172B4D] font-bold text-lg flex items-center justify-center shadow-xs">
                      {getPlayerById(nextPendingMatch.player2Id).name.charAt(0)}
                    </div>
                    <div className="font-bold text-base sm:text-lg text-[#172B4D] truncate">
                      {getPlayerById(nextPendingMatch.player2Id).name}
                    </div>
                    <div className="text-xs text-[#64748B]">Player #{nextPendingMatch.player2Id}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveMatchForScore(nextPendingMatch)}
                    className="w-full py-3.5 px-4 text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ENTER SCORE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#172B4D]">All 21 Matches Concluded!</h4>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Champion: <span className="font-bold text-[#172B4D]">{standings[0]?.player.name}</span> with {standings[0]?.pts} points!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('table')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  View Final Standings
                </button>
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                Recent Match Results
              </h3>
              <button
                onClick={() => setActiveTab('fixtures')}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                All Fixtures
              </button>
            </div>

            {recentCompletedMatches.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#64748B] bg-slate-50 rounded-xl border border-dashed border-[#E5E7EB]">
                No matches completed yet. Enter scores from the Fixtures tab.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentCompletedMatches.map((m) => {
                  const p1 = getPlayerById(m.player1Id);
                  const p2 = getPlayerById(m.player2Id);
                  const p1Won = (m.player1Score ?? 0) > (m.player2Score ?? 0);
                  const p2Won = (m.player2Score ?? 0) > (m.player1Score ?? 0);

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-[#64748B] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded">
                          R{m.round}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${p1Won ? 'text-[#172B4D] font-bold' : 'text-[#64748B]'}`}>
                            {p1.name}
                          </span>
                          <span className="text-sm font-mono font-bold text-[#172B4D] bg-white px-2.5 py-0.5 border border-[#E5E7EB] rounded tabular-nums">
                            {m.player1Score} - {m.player2Score}
                          </span>
                          <span className={`text-sm font-semibold ${p2Won ? 'text-[#172B4D] font-bold' : 'text-[#64748B]'}`}>
                            {p2.name}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveMatchForScore(m)}
                        className="text-xs font-semibold text-[#2563EB] hover:text-blue-800 px-2 py-1 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Leaderboard Podium
              </h3>
              <button
                onClick={() => setActiveTab('table')}
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <span>Full Table</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Top 3 Cards */}
            <div className="space-y-3">
              {topThree.map((standing: PlayerStanding) => {
                const isGold = standing.pos === 1;
                const isSilver = standing.pos === 2;
                const isBronze = standing.pos === 3;

                return (
                  <div
                    key={standing.player.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isGold
                        ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                        : isSilver
                        ? 'bg-slate-50/80 border-slate-300'
                        : isBronze
                        ? 'bg-orange-50/30 border-orange-200'
                        : 'bg-white border-[#E5E7EB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shadow-2xs ${
                          isGold
                            ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-200'
                            : isSilver
                            ? 'bg-slate-300 text-slate-800'
                            : isBronze
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 text-[#64748B]'
                        }`}
                      >
                        {standing.pos}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-[#172B4D] flex items-center gap-1.5">
                          <span>{standing.player.name}</span>
                          {isGold && <Award className="w-3.5 h-3.5 text-amber-600 inline" />}
                        </div>
                        <div className="text-xs text-[#64748B]">
                          MP: <span className="font-mono tabular-nums">{standing.mp}/6</span> · GD:{' '}
                          <span className="font-mono tabular-nums font-semibold">
                            {standing.gd > 0 ? `+${standing.gd}` : standing.gd}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-extrabold text-[#172B4D] font-mono tabular-nums">
                        {standing.pts} <span className="text-xs font-medium text-[#64748B]">PTS</span>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {standing.w}W {standing.d}D {standing.l}L
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Metrics at bottom */}
            <div className="mt-6 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                <div className="text-xs text-[#64748B] font-medium flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  Total Goals
                </div>
                <div className="text-xl font-extrabold text-[#172B4D] font-mono tabular-nums mt-0.5">
                  {stats.totalGoals}
                </div>
              </div>
              <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                <div className="text-xs text-[#64748B] font-medium">Avg Goals / Match</div>
                <div className="text-xl font-extrabold text-[#172B4D] font-mono tabular-nums mt-0.5">
                  {stats.avgGoals}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
