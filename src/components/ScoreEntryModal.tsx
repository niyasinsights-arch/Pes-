import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { X, Plus, Minus, Save, RotateCcw } from 'lucide-react';

export const ScoreEntryModal: React.FC = () => {
  const { activeMatchForScore, setActiveMatchForScore, updateMatchScore, clearMatchScore, getPlayerById } =
    useTournament();

  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  useEffect(() => {
    if (activeMatchForScore) {
      setScore1(activeMatchForScore.player1Score ?? 0);
      setScore2(activeMatchForScore.player2Score ?? 0);
    }
  }, [activeMatchForScore]);

  if (!activeMatchForScore) return null;

  const player1 = getPlayerById(activeMatchForScore.player1Id);
  const player2 = getPlayerById(activeMatchForScore.player2Id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalS1 = Math.max(0, Math.floor(score1));
    const finalS2 = Math.max(0, Math.floor(score2));
    updateMatchScore(activeMatchForScore.id, finalS1, finalS2);
    setActiveMatchForScore(null);
  };

  const handleClearScore = () => {
    if (window.confirm('Are you sure you want to reset this match to PENDING?')) {
      clearMatchScore(activeMatchForScore.id);
      setActiveMatchForScore(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      {/* Modal Container */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => setActiveMatchForScore(null)}
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#172B4D] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md">
            Round {activeMatchForScore.round} · Match {activeMatchForScore.matchIndex}
          </span>
          <h3 className="text-xl font-extrabold text-[#172B4D] mt-2">
            {activeMatchForScore.isCompleted ? 'Edit Match Score' : 'Enter Match Score'}
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Update goals for both players and save to recalculate tournament standings.
          </p>
        </div>

        {/* Score Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            {/* Player 1 Row */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs text-[#64748B] font-medium">Player 1</div>
                <div className="text-base sm:text-lg font-bold text-[#172B4D] truncate">
                  {player1.name}
                </div>
              </div>

              {/* Score 1 Stepper */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScore1((prev) => Math.max(0, prev - 1))}
                  className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-100 flex items-center justify-center text-[#172B4D] font-bold transition-colors cursor-pointer"
                  aria-label="Decrease Player 1 score"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={score1}
                  onChange={(e) => setScore1(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-14 h-11 text-center text-2xl font-bold font-mono text-[#172B4D] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => setScore1((prev) => prev + 1)}
                  className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-100 flex items-center justify-center text-[#172B4D] font-bold transition-colors cursor-pointer"
                  aria-label="Increase Player 1 score"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-center font-bold text-xs text-[#64748B] tracking-wider uppercase">
              VS
            </div>

            {/* Player 2 Row */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs text-[#64748B] font-medium">Player 2</div>
                <div className="text-base sm:text-lg font-bold text-[#172B4D] truncate">
                  {player2.name}
                </div>
              </div>

              {/* Score 2 Stepper */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScore2((prev) => Math.max(0, prev - 1))}
                  className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-100 flex items-center justify-center text-[#172B4D] font-bold transition-colors cursor-pointer"
                  aria-label="Decrease Player 2 score"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={score2}
                  onChange={(e) => setScore2(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-14 h-11 text-center text-2xl font-bold font-mono text-[#172B4D] bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => setScore2((prev) => prev + 1)}
                  className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-100 flex items-center justify-center text-[#172B4D] font-bold transition-colors cursor-pointer"
                  aria-label="Increase Player 2 score"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>SAVE RESULT</span>
            </button>

            {activeMatchForScore.isCompleted && (
              <button
                type="button"
                onClick={handleClearScore}
                className="w-full py-2.5 px-4 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Pending</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveMatchForScore(null)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
