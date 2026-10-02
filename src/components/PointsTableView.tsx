import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { PlayerStanding } from '../types/tournament';
import { Table, Trophy, Copy, Check, Info, Award, ArrowUpDown } from 'lucide-react';

export const PointsTableView: React.FC = () => {
  const { standings, showToast } = useTournament();
  const [copied, setCopied] = useState(false);

  const handleCopyStandings = () => {
    let text = `🏆 PES TOURNAMENT 2026 - STANDINGS 🏆\n\n`;
    text += `POS | PLAYER | MP | W | D | L | GF | GA | GD | PTS\n`;
    text += `--------------------------------------------------\n`;
    standings.forEach((s) => {
      const gdStr = s.gd > 0 ? `+${s.gd}` : `${s.gd}`;
      text += `${s.pos}. ${s.player.name.padEnd(8)} | ${s.mp} | ${s.w} | ${s.d} | ${s.l} | ${s.gf} | ${s.ga} | ${gdStr.padStart(3)} | ${s.pts} pts\n`;
    });
    text += `\nFormat: Single Round Robin (7 Players, 21 Matches)`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast('Standings copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar of Points Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D] flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Tournament Standings
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Automatic real-time calculation · Win: 3 pts | Draw: 1 pt | Loss: 0 pts
          </p>
        </div>

        <button
          onClick={handleCopyStandings}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#172B4D] bg-white hover:bg-slate-50 active:bg-slate-100 border border-[#E5E7EB] rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="text-[#16A34A]">Copied Table</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Copy Standings</span>
            </>
          )}
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] sm:text-xs font-bold text-[#64748B] uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-14">POS</th>
                <th className="py-3.5 px-4 text-left">PLAYER</th>
                <th className="py-3.5 px-3 text-center">MP</th>
                <th className="py-3.5 px-3 text-center">W</th>
                <th className="py-3.5 px-3 text-center">D</th>
                <th className="py-3.5 px-3 text-center">L</th>
                <th className="py-3.5 px-3 text-center">GF</th>
                <th className="py-3.5 px-3 text-center">GA</th>
                <th className="py-3.5 px-3 text-center">GD</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-[#172B4D]">PTS</th>
                <th className="py-3.5 px-4 text-center hidden md:table-cell">FORM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {standings.map((row: PlayerStanding) => {
                const isGold = row.pos === 1;
                const isSilver = row.pos === 2;
                const isBronze = row.pos === 3;

                return (
                  <tr
                    key={row.player.id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isGold
                        ? 'bg-amber-50/20'
                        : isSilver
                        ? 'bg-slate-50/30'
                        : isBronze
                        ? 'bg-orange-50/15'
                        : ''
                    }`}
                  >
                    {/* POS */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {isGold ? (
                          <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center justify-center shadow-xs ring-2 ring-amber-200">
                            1
                          </span>
                        ) : isSilver ? (
                          <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-extrabold text-xs flex items-center justify-center shadow-xs">
                            2
                          </span>
                        ) : isBronze ? (
                          <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                            3
                          </span>
                        ) : (
                          <span className="font-mono text-xs font-bold text-[#64748B] tabular-nums">
                            {row.pos}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* PLAYER */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-[#172B4D] font-bold text-xs flex items-center justify-center border border-[#E5E7EB] shrink-0">
                          {row.player.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#172B4D] flex items-center gap-1.5">
                            <span>{row.player.name}</span>
                            {isGold && (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                1st
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#64748B]">Player #{row.player.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* MP */}
                    <td className="py-3.5 px-3 text-center font-mono text-sm font-semibold text-[#172B4D] tabular-nums">
                      {row.mp}
                    </td>

                    {/* W */}
                    <td className="py-3.5 px-3 text-center font-mono text-sm text-[#16A34A] font-bold tabular-nums">
                      {row.w}
                    </td>

                    {/* D */}
                    <td className="py-3.5 px-3 text-center font-mono text-sm text-[#64748B] font-semibold tabular-nums">
                      {row.d}
                    </td>

                    {/* L */}
                    <td className="py-3.5 px-3 text-center font-mono text-sm text-red-500 font-semibold tabular-nums">
                      {row.l}
                    </td>

                    {/* GF */}
                    <td className="py-3.5 px-3 text-center font-mono text-sm text-[#172B4D] tabular-nums">
                      {row.gf}
                    </td>

                    {/* GA */}
                    <td className="py-3.5 px-3 text-center font-mono text-sm text-[#64748B] tabular-nums">
                      {row.ga}
                    </td>

                    {/* GD */}
                    <td className="py-3.5 px-3 text-center font-mono text-sm font-bold tabular-nums">
                      <span
                        className={
                          row.gd > 0
                            ? 'text-[#16A34A]'
                            : row.gd < 0
                            ? 'text-red-500'
                            : 'text-[#64748B]'
                        }
                      >
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </span>
                    </td>

                    {/* PTS */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-base font-extrabold text-[#172B4D] bg-slate-50 border border-[#E5E7EB] px-2.5 py-1 rounded-md tabular-nums inline-block min-w-9">
                        {row.pts}
                      </span>
                    </td>

                    {/* FORM */}
                    <td className="py-3.5 px-4 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.length === 0 ? (
                          <span className="text-xs text-[#64748B]">-</span>
                        ) : (
                          row.form.map((res, i) => (
                            <span
                              key={i}
                              className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                res === 'W'
                                  ? 'bg-green-100 text-[#16A34A]'
                                  : res === 'D'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-600'
                              }`}
                              title={res === 'W' ? 'Win' : res === 'D' ? 'Draw' : 'Loss'}
                            >
                              {res}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tie-breaking Rules and Table Legend */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#E5E7EB] text-xs text-[#64748B] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>
              <strong>Sorting Criteria:</strong> 1. Total Points &rarr; 2. Goal Difference &rarr; 3. Goals For &rarr; 4. Head-to-Head Result
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> 1st Gold
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> 2nd Silver
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700" /> 3rd Bronze
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
