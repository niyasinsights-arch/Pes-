/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { FixturesView } from './components/FixturesView';
import { PointsTableView } from './components/PointsTableView';
import { PlayersView } from './components/PlayersView';
import { ScoreEntryModal } from './components/ScoreEntryModal';
import { EditPlayerModal } from './components/EditPlayerModal';
import { ResetModal } from './components/ResetModal';

const TournamentApp: React.FC = () => {
  const { activeTab } = useTournament();

  return (
    <div className="min-h-screen bg-white text-[#172B4D] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'fixtures' && <FixturesView />}
        {activeTab === 'table' && <PointsTableView />}
        {activeTab === 'players' && <PlayersView />}
      </main>

      {/* Global Modals */}
      <ScoreEntryModal />
      <EditPlayerModal />
      <ResetModal />

      {/* Quiet Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172B4D]">PES TOURNAMENT 2026</span>
            <span>·</span>
            <span>Single Round Robin</span>
            <span>·</span>
            <span>7 Players</span>
          </div>
          <div>
            Data is saved locally in your browser. Refreshing will keep all scores.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <TournamentProvider>
      <TournamentApp />
    </TournamentProvider>
  );
}
