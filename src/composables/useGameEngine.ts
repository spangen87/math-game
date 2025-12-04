import { ref } from 'vue';
import type { GameConfig, GameState, MathProblem, Operator } from '../types';
import { useAudio } from './useAudio';

export function useGameEngine() {
    const { playCorrect, playWrong, playGameOver } = useAudio();

    const config = ref<GameConfig>({
        operators: ['+'],
        difficulty: 'Easy',
        playerName: '',
        mode: 'ranked',
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
        const ops: Operator[] = config.value.operators.length > 0 ? config.value.operators : ['+'];
        const currentOp = ops[Math.floor(Math.random() * ops.length)] as Operator;

        let min = 1;
        let max = 10;

        if (config.value.difficulty === 'Medium') {
            min = 5;
            max = 20;
        } else if (config.value.difficulty === 'Hard') {
            min = 10;
            max = 50;
        }

        // Adjust for multiplication and division to keep it reasonable
        if (currentOp === '×' || currentOp === '÷') {
            if (config.value.difficulty === 'Easy') max = 5;
            if (config.value.difficulty === 'Medium') max = 10;
            if (config.value.difficulty === 'Hard') max = 12;
        }

        let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        let num2 = Math.floor(Math.random() * (max - min + 1)) + min;

        if (currentOp === '÷') {
            // For division, ensure integer result by making num1 a multiple of num2
            const divisor = num2;
            const quotient = num1; // reuse generated number as quotient
            num1 = divisor * quotient;
            // num2 is the divisor
        }

        // Ensure subtraction doesn't result in negative numbers
        if (currentOp === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        let answer = 0;
        switch (currentOp) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '×': answer = num1 * num2; break;
            case '÷': answer = num1 / num2; break;
        }

        return { num1, num2, operator: currentOp, answer };
    };

    const startGame = () => {
        state.value.status = 'playing';
        state.value.score = 0;
        state.value.timeLeft = 60;
        state.value.streak = 0;
        state.value.currentProblem = generateProblem();

        if (config.value.mode === 'ranked') {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = window.setInterval(() => {
                state.value.timeLeft--;
                if (state.value.timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
        }
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
            if (config.value.mode === 'ranked') {
                state.value.score += 10 + Math.floor(state.value.streak / 3) * 5; // Bonus for streaks
                state.value.streak++;
            }
            playCorrect();
            state.value.currentProblem = generateProblem();
            return true;
        } else {
            // Wrong
            if (config.value.mode === 'ranked') {
                state.value.streak = 0;
            }
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
