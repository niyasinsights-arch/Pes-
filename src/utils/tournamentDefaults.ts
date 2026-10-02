import { Match, Player, PlayerStanding, RoundInfo } from '../types/tournament';

export const DEFAULT_PLAYERS: Player[] = [
  { id: 1, name: 'Achu', number: 1 },
  { id: 2, name: 'Niyas', number: 2 },
  { id: 3, name: 'Abi', number: 3 },
  { id: 4, name: 'Rinshad', number: 4 },
  { id: 5, name: 'Kunnava', number: 5 },
  { id: 6, name: 'Habeeb', number: 6 },
  { id: 7, name: 'Nonnnu', number: 7 },
];

export const ROUND_SCHEDULE_SCHEMA: { round: number; byeId: number; pairings: [number, number][] }[] = [
  {
    round: 1,
    byeId: 7, // Nonnnu
    pairings: [
      [1, 2], // Achu vs Niyas
      [3, 4], // Abi vs Rinshad
      [5, 6], // Kunnava vs Habeeb
    ],
  },
  {
    round: 2,
    byeId: 1, // Achu
    pairings: [
      [2, 3], // Niyas vs Abi
      [4, 5], // Rinshad vs Kunnava
      [6, 7], // Habeeb vs Nonnnu
    ],
  },
  {
    round: 3,
    byeId: 2, // Niyas
    pairings: [
      [1, 3], // Achu vs Abi
      [4, 6], // Rinshad vs Habeeb
      [5, 7], // Kunnava vs Nonnnu
    ],
  },
  {
    round: 4,
    byeId: 3, // Abi
    pairings: [
      [1, 5], // Achu vs Kunnava
      [2, 6], // Niyas vs Habeeb
      [4, 7], // Rinshad vs Nonnnu
    ],
  },
  {
    round: 5,
    byeId: 4, // Rinshad
    pairings: [
      [1, 6], // Achu vs Habeeb
      [2, 5], // Niyas vs Kunnava
      [3, 7], // Abi vs Nonnnu
    ],
  },
  {
    round: 6,
    byeId: 5, // Kunnava
    pairings: [
      [1, 4], // Achu vs Rinshad
      [2, 7], // Niyas vs Nonnnu
      [3, 6], // Abi vs Habeeb
    ],
  },
  {
    round: 7,
    byeId: 6, // Habeeb
    pairings: [
      [1, 7], // Achu vs Nonnnu
      [2, 4], // Niyas vs Rinshad
      [3, 5], // Abi vs Kunnava
    ],
  },
];

export function createInitialMatches(): Match[] {
  const matches: Match[] = [];
  ROUND_SCHEDULE_SCHEMA.forEach((roundSchema) => {
    roundSchema.pairings.forEach((pairing, index) => {
      matches.push({
        id: `r${roundSchema.round}-m${index + 1}`,
        round: roundSchema.round,
        matchIndex: index + 1,
        player1Id: pairing[0],
        player2Id: pairing[1],
        player1Score: null,
        player2Score: null,
        isCompleted: false,
      });
    });
  });
  return matches;
}

export function groupMatchesByRound(matches: Match[]): RoundInfo[] {
  return ROUND_SCHEDULE_SCHEMA.map((roundSchema) => {
    const roundMatches = matches.filter((m) => m.round === roundSchema.round);
    return {
      roundNumber: roundSchema.round,
      byePlayerId: roundSchema.byeId,
      matches: roundMatches,
    };
  });
}

/**
 * Calculates standings based on matches and registered players.
 * Sorting rules:
 * 1. Total Points (PTS) DESC (Win=3, Draw=1, Loss=0)
 * 2. Goal Difference (GD) DESC
 * 3. Goals For (GF) DESC
 * 4. Head-to-Head result between tied players
 * 5. Player number ASC
 */
export function calculateStandings(players: Player[], matches: Match[]): PlayerStanding[] {
  // Initialize map
  const statsMap = new Map<number, {
    mp: number;
    w: number;
    d: number;
    l: number;
    gf: number;
    ga: number;
    gd: number;
    pts: number;
    form: ('W' | 'D' | 'L')[];
  }>();

  players.forEach((p) => {
    statsMap.set(p.id, {
      mp: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      form: [],
    });
  });

  // Sort matches by round to compute chronological form
  const sortedMatches = [...matches].sort((a, b) => a.round - b.round || a.matchIndex - b.matchIndex);

  sortedMatches.forEach((m) => {
    if (m.isCompleted && m.player1Score !== null && m.player2Score !== null) {
      const p1 = statsMap.get(m.player1Id);
      const p2 = statsMap.get(m.player2Id);

      if (p1 && p2) {
        const s1 = m.player1Score;
        const s2 = m.player2Score;

        p1.mp += 1;
        p2.mp += 1;

        p1.gf += s1;
        p1.ga += s2;
        p1.gd = p1.gf - p1.ga;

        p2.gf += s2;
        p2.ga += s1;
        p2.gd = p2.gf - p2.ga;

        if (s1 > s2) {
          p1.w += 1;
          p1.pts += 3;
          p1.form.push('W');

          p2.l += 1;
          p2.form.push('L');
        } else if (s1 < s2) {
          p2.w += 1;
          p2.pts += 3;
          p2.form.push('W');

          p1.l += 1;
          p1.form.push('L');
        } else {
          p1.d += 1;
          p1.pts += 1;
          p1.form.push('D');

          p2.d += 1;
          p2.pts += 1;
          p2.form.push('D');
        }
      }
    }
  });

  // Convert to array
  const standingsList: PlayerStanding[] = players.map((player) => {
    const stats = statsMap.get(player.id) || {
      mp: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      form: [],
    };

    return {
      player,
      pos: 1, // Will be set after sorting
      ...stats,
      // Keep only last 5 form elements
      form: stats.form.slice(-5),
    };
  });

  // Sorting with Head-to-Head tiebreak
  standingsList.sort((a, b) => {
    // 1. Points
    if (b.pts !== a.pts) return b.pts - a.pts;

    // 2. Goal Difference
    if (b.gd !== a.gd) return b.gd - a.gd;

    // 3. Goals For
    if (b.gf !== a.gf) return b.gf - a.gf;

    // 4. Head to Head
    const h2hMatch = matches.find(
      (m) =>
        m.isCompleted &&
        m.player1Score !== null &&
        m.player2Score !== null &&
        ((m.player1Id === a.player.id && m.player2Id === b.player.id) ||
         (m.player1Id === b.player.id && m.player2Id === a.player.id))
    );

    if (h2hMatch && h2hMatch.player1Score !== null && h2hMatch.player2Score !== null) {
      const aScore = h2hMatch.player1Id === a.player.id ? h2hMatch.player1Score : h2hMatch.player2Score;
      const bScore = h2hMatch.player1Id === b.player.id ? h2hMatch.player1Score : h2hMatch.player2Score;
      if (aScore !== bScore) {
        return bScore - aScore; // If aScore > bScore, a comes first (negative value)
      }
    }

    // 5. Default by original player number
    return a.player.number - b.player.number;
  });

  // Assign positions
  return standingsList.map((standing, index) => ({
    ...standing,
    pos: index + 1,
  }));
}
