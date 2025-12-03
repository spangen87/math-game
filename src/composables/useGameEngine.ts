import { ref } from 'vue';
import type { GameConfig, GameState, MathProblem } from '../types';
import { useAudio } from './useAudio';

export function useGameEngine() {
    const { playCorrect, playWrong, playGameOver } = useAudio();

    const config = ref<GameConfig>({
        operator: '+',
        difficulty: 'Easy',
        playerName: '',
    });

    const state = ref<GameState>({
        status: 'idle',
        score: 0,
        timeLeft: 60,
        currentProblem: null,
        streak: 0,
    });

    let timerInterval: number | null = null;

    const generateProblem = (): MathProblem => {
        let min = 1;
        let max = 10;

        if (config.value.difficulty === 'Medium') {
            min = 5;
            max = 20;
        } else if (config.value.difficulty === 'Hard') {
            min = 10;
            max = 50;
        }

        // Adjust for multiplication to keep it reasonable
        if (config.value.operator === '×') {
            if (config.value.difficulty === 'Easy') max = 5;
            if (config.value.difficulty === 'Medium') max = 10;
            if (config.value.difficulty === 'Hard') max = 12;
        }

        let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        let num2 = Math.floor(Math.random() * (max - min + 1)) + min;

        // Ensure subtraction doesn't result in negative numbers
        if (config.value.operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        let answer = 0;
        switch (config.value.operator) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '×': answer = num1 * num2; break;
        }

        return { num1, num2, operator: config.value.operator, answer };
    };

    const startGame = () => {
        state.value.status = 'playing';
        state.value.score = 0;
        state.value.timeLeft = 60;
        state.value.streak = 0;
        state.value.currentProblem = generateProblem();

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = window.setInterval(() => {
            state.value.timeLeft--;
            if (state.value.timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    };

    const endGame = () => {
        state.value.status = 'finished';
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        playGameOver();
    };

    const checkAnswer = (input: number): boolean => {
        if (!state.value.currentProblem) return false;

        if (input === state.value.currentProblem.answer) {
            // Correct
            state.value.score += 10 + Math.floor(state.value.streak / 3) * 5; // Bonus for streaks
            state.value.streak++;
            playCorrect();
            state.value.currentProblem = generateProblem();
            return true;
        } else {
            // Wrong
            state.value.streak = 0;
            playWrong();
            return false;
        }
    };

    const resetGame = () => {
        state.value.status = 'idle';
        state.value.score = 0;
        state.value.timeLeft = 60;
        state.value.streak = 0;
        state.value.currentProblem = null;
    };

    return {
        config,
        state,
        startGame,
        endGame,
        checkAnswer,
        resetGame,
    };
}
