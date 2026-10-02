import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { Player, PlayerStanding } from '../types/tournament';
import { Users, Edit3, Trophy, CheckCircle2, Clock } from 'lucide-react';

export const PlayersView: React.FC = () => {
  const { players, standings, matches, setActivePlayerForEdit, setActiveMatchForScore } = useTournament();

  const getPlayerStats = (playerId: number): PlayerStanding | undefined => {
    return standings.find((s) => s.player.id === playerId);
  };

  // Get all 6 matches for a specific player
  const getPlayerMatches = (playerId: number) => {
    return matches.filter((m) => m.player1Id === playerId || m.player2Id === playerId);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#2563EB]" />
            Registered Players (7)
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Click edit on any player card to update their display name across all fixtures and standings.
          </p>
        </div>
      </div>

      {/* 7 Player Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {players.map((player: Player) => {
          const stats = getPlayerStats(player.id);
          const playerMatches = getPlayerMatches(player.id);
          const completedCount = playerMatches.filter((m) => m.isCompleted).length;
          const pos = stats?.pos ?? player.number;
          const isGold = pos === 1;

          return (
            <div
              key={player.id}
              className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all ${
                isGold ? 'border-amber-300 ring-1 ring-amber-100' : 'border-[#E5E7EB]'
              }`}
            >
              <div>
                {/* Player Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB] font-extrabold text-lg flex items-center justify-center shadow-xs">
                      #{player.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#172B4D] leading-tight">
                        {player.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
                        <span>Rank #{pos}</span>
                        <span>·</span>
                        <span>{stats?.pts ?? 0} pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => setActivePlayerForEdit(player)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] bg-slate-50 hover:bg-blue-50 border border-[#E5E7EB] hover:border-blue-200 rounded-lg transition-colors cursor-pointer"
                    title="Edit player name"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2 text-center p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl mb-4 text-xs">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B]">Played</div>
                    <div className="font-mono font-bold text-[#172B4D] text-sm tabular-nums mt-0.5">
                      {stats?.mp ?? 0}/6
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B]">W-D-L</div>
                    <div className="font-mono font-bold text-[#172B4D] text-xs tabular-nums mt-0.5">
                      {stats?.w ?? 0}-{stats?.d ?? 0}-{stats?.l ?? 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B]">GF/GA</div>
                    <div className="font-mono font-bold text-[#172B4D] text-xs tabular-nums mt-0.5">
                      {stats?.gf ?? 0}/{stats?.ga ?? 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B]">GD</div>
                    <div
                      className={`font-mono font-bold text-xs tabular-nums mt-0.5 ${
                        (stats?.gd ?? 0) > 0
                          ? 'text-[#16A34A]'
                          : (stats?.gd ?? 0) < 0
                          ? 'text-red-500'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {(stats?.gd ?? 0) > 0 ? `+${stats?.gd}` : stats?.gd ?? 0}
                    </div>
                  </div>
                </div>

                {/* Fixtures mini list for this player */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                    Opponents ({completedCount}/6 completed)
                  </div>
                  <div className="space-y-1 text-xs">
                    {playerMatches.map((m) => {
                      const isP1 = m.player1Id === player.id;
                      const opponentId = isP1 ? m.player2Id : m.player1Id;
                      const opponent = players.find((p) => p.id === opponentId) || { name: `P${opponentId}` };
                      const playerScore = isP1 ? m.player1Score : m.player2Score;
                      const opponentScore = isP1 ? m.player2Score : m.player1Score;

                      let resultBadge = null;
                      if (m.isCompleted && playerScore !== null && opponentScore !== null) {
                        if (playerScore > opponentScore) {
                          resultBadge = (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-green-100 text-[#16A34A]">
                              W ({playerScore}-{opponentScore})
                            </span>
                          );
                        } else if (playerScore < opponentScore) {
                          resultBadge = (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-600">
                              L ({playerScore}-{opponentScore})
                            </span>
                          );
                        } else {
                          resultBadge = (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700">
                              D ({playerScore}-{opponentScore})
                            </span>
                          );
                        }
                      } else {
                        resultBadge = (
                          <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-1.5 py-0.2 rounded">
                            Pending
                          </span>
                        );
                      }

                      return (
                        <div
                          key={m.id}
                          onClick={() => setActiveMatchForScore(m)}
                          className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-[#E5E7EB]"
                          title="Click to view/enter match score"
                        >
                          <span className="text-[#172B4D] font-medium truncate">
                            <span className="text-[#64748B] text-[10px] mr-1.5">R{m.round}</span>
                            vs {opponent.name}
                          </span>
                          {resultBadge}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
