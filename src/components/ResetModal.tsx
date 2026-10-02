import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { AlertTriangle, X, RotateCcw, Trash2 } from 'lucide-react';

export const ResetModal: React.FC = () => {
  const { isResetModalOpen, setIsResetModalOpen, resetTournament } = useTournament();

  if (!isResetModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsResetModalOpen(false)}
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#172B4D] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#172B4D]">Reset Tournament</h3>
            <p className="text-xs text-[#64748B]">Choose how you would like to reset the tournament.</p>
          </div>
        </div>

        <div className="space-y-3 my-6">
          {/* Option 1: Reset Scores Only */}
          <button
            onClick={() => {
              resetTournament('scores_only');
              setIsResetModalOpen(false);
            }}
            className="w-full text-left p-4 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-blue-50/30 transition-all flex items-start gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-[#2563EB] shrink-0 mt-0.5">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#172B4D] group-hover:text-[#2563EB]">
                Reset Scores Only
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">
                Clears all match results and sets table to 0-0. Your current player names are preserved.
              </div>
            </div>
          </button>

          {/* Option 2: Full Factory Reset */}
          <button
            onClick={() => {
              resetTournament('all_defaults');
              setIsResetModalOpen(false);
            }}
            className="w-full text-left p-4 rounded-xl border border-red-200 bg-red-50/20 hover:bg-red-50/60 transition-all flex items-start gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-red-100 text-red-600 shrink-0 mt-0.5">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-red-600">
                Full Reset to Initial Defaults
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">
                Resets player names to original 7 (Achu, Niyas, Abi, Rinshad, Kunnava, Habeeb, Nonnnu) and clears all scores.
              </div>
            </div>
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsResetModalOpen(false)}
            className="py-2.5 px-5 text-xs font-semibold text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
