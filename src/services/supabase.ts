import { createClient } from '@supabase/supabase-js';
import type { LeaderboardEntry } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    if (!supabase) {
        console.warn('Supabase credentials missing. Using mock data.');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { player_name: 'Anna', score: 150, difficulty: 'Hard', operation: '×' },
                    { player_name: 'Erik', score: 120, difficulty: 'Medium', operation: '+' },
                    { player_name: 'Lars', score: 90, difficulty: 'Easy', operation: '-' },
                    { player_name: 'Karin', score: 85, difficulty: 'Medium', operation: '×' },
                    { player_name: 'Olof', score: 70, difficulty: 'Easy', operation: '+' },
                ]);
            }, 500);
        });
    }

    const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }

    return data as LeaderboardEntry[];
};

export const submitScore = async (entry: LeaderboardEntry): Promise<void> => {
    if (!supabase) {
        console.log('Mock submitting score:', entry);
        return;
    }

    const { error } = await supabase
        .from('leaderboard')
        .insert([entry]);

    if (error) {
        console.error('Error submitting score:', error);
    }
};
