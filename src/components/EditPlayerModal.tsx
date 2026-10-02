import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import { X, Check } from 'lucide-react';

export const EditPlayerModal: React.FC = () => {
  const { activePlayerForEdit, setActivePlayerForEdit, updatePlayerName } = useTournament();
  const [name, setName] = useState('');

  useEffect(() => {
    if (activePlayerForEdit) {
      setName(activePlayerForEdit.name);
    }
  }, [activePlayerForEdit]);

  if (!activePlayerForEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updatePlayerName(activePlayerForEdit.id, name.trim());
      setActivePlayerForEdit(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-sm w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setActivePlayerForEdit(null)}
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#172B4D] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-[#172B4D]">
          Edit Player #{activePlayerForEdit.number}
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Changing this name will update all fixtures, standings, and history.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1.5">
              Player Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-medium text-[#172B4D] bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              placeholder="Enter player name"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Name</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlayerForEdit(null)}
              className="py-2.5 px-4 text-xs font-semibold text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
