export type Operator = '+' | '-' | '×' | '÷';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type GameMode = 'ranked' | 'practice';

export interface GameConfig {
    operators: Operator[];
    difficulty: Difficulty;
    playerName: string;
    mode: GameMode;
}

export interface MathProblem {
    num1: number;
    num2: number;
    operator: Operator;
    answer: number;
}

export interface GameState {
    status: 'idle' | 'playing' | 'finished';
    score: number;
    timeLeft: number;
    currentProblem: MathProblem | null;
    streak: number;
    skipsUsed: number;
}

export interface LeaderboardEntry {
    id?: string;
    player_name: string;
    score: number;
    difficulty: Difficulty;
    operation: Operator;
    created_at?: string;
}
