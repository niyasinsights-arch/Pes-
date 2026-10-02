export interface Player {
  id: number;
  name: string;
  number: number; // 1 to 7
}

export interface Match {
  id: string; // e.g. "m-1-1" (round 1, match 1)
  round: number;
  matchIndex: number;
  player1Id: number;
  player2Id: number;
  player1Score: number | null;
  player2Score: number | null;
  isCompleted: boolean;
  updatedAt?: string;
}

export interface RoundInfo {
  roundNumber: number;
  matches: Match[];
  byePlayerId: number;
}

export interface PlayerStanding {
  player: Player;
  pos: number;
  mp: number; // Matches Played
  w: number;  // Wins
  d: number;  // Draws
  l: number;  // Losses
  gf: number; // Goals For
  ga: number; // Goals Against
  gd: number; // Goal Difference
  pts: number; // Total Points
  form: ('W' | 'D' | 'L')[];
}

export interface HeadToHeadRecord {
  opponentId: number;
  played: boolean;
  scoreDisplay?: string;
  result?: 'W' | 'D' | 'L';
}

export type NavTab = 'dashboard' | 'fixtures' | 'table' | 'players';
