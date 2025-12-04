import { createClient } from '@supabase/supabase-js';
import type { LeaderboardEntry } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase only if keys are present
const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const STORAGE_KEY = 'math_game_leaderboard';

// Helper to get local leaderboard
const getLocalLeaderboard = (): LeaderboardEntry[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

// Helper to save local leaderboard
const saveLocalLeaderboard = (data: LeaderboardEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    // If Supabase is configured, try to use it
    if (supabase) {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('score', { ascending: false })
            .limit(10);

        if (!error && data) {
            return data as LeaderboardEntry[];
        }
        console.error('Error fetching from Supabase, falling back to local:', error);
    }

    // Fallback to LocalStorage (or if Supabase is not configured)
    const localData = getLocalLeaderboard();

    // If local data is empty, maybe seed it with some bots for fun?
    if (localData.length === 0) {
        const mockData: LeaderboardEntry[] = [
            { player_name: 'Robot-Anna', score: 150, difficulty: 'Hard', operation: '×' },
            { player_name: 'Robot-Erik', score: 120, difficulty: 'Medium', operation: '+' },
            { player_name: 'Robot-Lars', score: 90, difficulty: 'Easy', operation: '-' },
        ];
        saveLocalLeaderboard(mockData);
        return mockData;
    }

    return localData.sort((a, b) => b.score - a.score).slice(0, 10);
};

export const submitScore = async (entry: LeaderboardEntry): Promise<void> => {
    // 1. Always save to LocalStorage first (so user sees it immediately)
    const localData = getLocalLeaderboard();
    localData.push({ ...entry, created_at: new Date().toISOString() });
    // Sort and keep top 50 locally to avoid unlimited growth
    const sorted = localData.sort((a, b) => b.score - a.score).slice(0, 50);
    saveLocalLeaderboard(sorted);

    // 2. If Supabase is configured, also sync there
    if (supabase) {
        const { error } = await supabase
            .from('leaderboard')
            .insert([entry]);

        if (error) {
            console.error('Error submitting score to Supabase:', error);
        }
    }
};

