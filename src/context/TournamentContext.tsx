import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Match, NavTab, Player, PlayerStanding, RoundInfo } from '../types/tournament';
import {
  calculateStandings,
  createInitialMatches,
  DEFAULT_PLAYERS,
  groupMatchesByRound,
} from '../utils/tournamentDefaults';

const STORAGE_KEY_PLAYERS = 'pes_tournament_2026_players';
const STORAGE_KEY_MATCHES = 'pes_tournament_2026_matches';

interface TournamentStats {
  totalPlayers: number;
  totalMatches: number;
  completedMatches: number;
  remainingMatches: number;
  progressPercent: number;
  totalGoals: number;
  avgGoals: string;
  leader: PlayerStanding | null;
  topScorer: { player: Player; goals: number } | null;
}

interface TournamentContextType {
  players: Player[];
  matches: Match[];
  standings: PlayerStanding[];
  rounds: RoundInfo[];
  stats: TournamentStats;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  updateMatchScore: (matchId: string, p1Score: number, p2Score: number) => void;
  clearMatchScore: (matchId: string) => void;
  updatePlayerName: (playerId: number, newName: string) => void;
  resetTournament: (mode: 'scores_only' | 'all_defaults') => void;
  getPlayerById: (id: number) => Player;
  activeMatchForScore: Match | null;
  setActiveMatchForScore: (match: Match | null) => void;
  activePlayerForEdit: Player | null;
  setActivePlayerForEdit: (player: Player | null) => void;
  isResetModalOpen: boolean;
  setIsResetModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize Players from LocalStorage or Defaults
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PLAYERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 7) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PLAYERS;
  });

  // 2. Initialize Matches from LocalStorage or Defaults
  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MATCHES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 21) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return createInitialMatches();
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [activeMatchForScore, setActiveMatchForScore] = useState<Match | null>(null);
  const [activePlayerForEdit, setActivePlayerForEdit] = useState<Player | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  // Sync Players to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
    } catch {
      // localstorage full/unavailable
    }
  }, [players]);

  // Sync Matches to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
    } catch {
      // localstorage full/unavailable
    }
  }, [matches]);

  const playerMap = useMemo(() => {
    const map = new Map<number, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  const getPlayerById = (id: number): Player => {
    return playerMap.get(id) || { id, name: `Player ${id}`, number: id };
  };

  // Compute standings in real time
  const standings = useMemo(() => {
    return calculateStandings(players, matches);
  }, [players, matches]);

  // Group matches by round
  const rounds = useMemo(() => {
    return groupMatchesByRound(matches);
  }, [matches]);

  // Compute overall stats
  const stats = useMemo<TournamentStats>(() => {
    const totalMatches = matches.length;
    const completedMatches = matches.filter((m) => m.isCompleted).length;
    const remainingMatches = totalMatches - completedMatches;
    const progressPercent = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;

    let totalGoals = 0;
    matches.forEach((m) => {
      if (m.isCompleted && m.player1Score !== null && m.player2Score !== null) {
        totalGoals += m.player1Score + m.player2Score;
      }
    });

    const avgGoals = completedMatches > 0 ? (totalGoals / completedMatches).toFixed(1) : '0.0';

    // Top scorer
    let topScorer: { player: Player; goals: number } | null = null;
    let maxGoals = 0;
    standings.forEach((st) => {
      if (st.gf > maxGoals) {
        maxGoals = st.gf;
        topScorer = { player: st.player, goals: st.gf };
      }
    });

    const leader = completedMatches > 0 ? standings[0] : null;

    return {
      totalPlayers: players.length,
      totalMatches,
      completedMatches,
      remainingMatches,
      progressPercent,
      totalGoals,
      avgGoals,
      leader,
      topScorer,
    };
  }, [matches, players.length, standings]);

  const updateMatchScore = (matchId: string, p1Score: number, p2Score: number) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            player1Score: p1Score,
            player2Score: p2Score,
            isCompleted: true,
            updatedAt: new Date().toISOString(),
          };
        }
        return m;
      })
    );
    showToast('Match result saved successfully');
  };

  const clearMatchScore = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            player1Score: null,
            player2Score: null,
            isCompleted: false,
            updatedAt: undefined,
          };
        }
        return m;
      })
    );
    showToast('Match score cleared');
  };

  const updatePlayerName = (playerId: number, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          return { ...p, name: trimmed };
        }
        return p;
      })
    );
    showToast(`Player #${playerId} renamed to "${trimmed}"`);
  };

  const resetTournament = (mode: 'scores_only' | 'all_defaults') => {
    if (mode === 'all_defaults') {
      setPlayers(DEFAULT_PLAYERS);
      setMatches(createInitialMatches());
      localStorage.removeItem(STORAGE_KEY_PLAYERS);
      localStorage.removeItem(STORAGE_KEY_MATCHES);
      showToast('Tournament completely reset to original defaults');
    } else {
      setMatches(createInitialMatches());
      localStorage.removeItem(STORAGE_KEY_MATCHES);
      showToast('All match results reset. Player names preserved.');
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        players,
        matches,
        standings,
        rounds,
        stats,
        activeTab,
        setActiveTab,
        updateMatchScore,
        clearMatchScore,
        updatePlayerName,
        resetTournament,
        getPlayerById,
        activeMatchForScore,
        setActiveMatchForScore,
        activePlayerForEdit,
        setActivePlayerForEdit,
        isResetModalOpen,
        setIsResetModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
