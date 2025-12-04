<script setup lang="ts">
import { ref, watch } from 'vue';
import confetti from 'canvas-confetti';
import SetupView from './views/SetupView.vue';
import GameView from './views/GameView.vue';
import LeaderboardView from './views/LeaderboardView.vue';
import FeedbackOverlay from './components/FeedbackOverlay.vue';
import { useGameEngine } from './composables/useGameEngine';
import { submitScore } from './services/leaderboard';

const { config, state, startGame, endGame, checkAnswer, resetGame } = useGameEngine();

// Feedback state
const feedbackTrigger = ref(0);
const feedbackType = ref<'correct' | 'wrong'>('correct');
const lastScoreDelta = ref(10);
const shakeTrigger = ref(0);
const viewingLeaderboard = ref(false);

const handleStart = () => {
  startGame();
};

const handleInput = (val: number) => {
  const correct = checkAnswer(val);
  feedbackType.value = correct ? 'correct' : 'wrong';
  if (correct) {
    lastScoreDelta.value = 10 + Math.floor(state.value.streak / 3) * 5;
    
    // Random confetti effect
    const effect = Math.floor(Math.random() * 4);
    
    if (effect === 0) {
      // Classic
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#0EA5E9', '#22C55E', '#EAB308', '#EF4444']
      });
    } else if (effect === 1) {
      // Stars
      confetti({
        shapes: ['star'],
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
        particleCount: 20,
        spread: 70,
        origin: { y: 0.7 }
      });
    } else if (effect === 2) {
      // Side Cannons (School Pride style)
      confetti({
        particleCount: 15,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#0EA5E9', '#22C55E']
      });
      confetti({
        particleCount: 15,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#EAB308', '#EF4444']
      });
    } else {
      // Burst (Fireworks)
      const randomX = Math.random() * 0.4 + 0.3; // 0.3 - 0.7
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { x: randomX, y: 0.6 },
        startVelocity: 30,
        gravity: 0.8
      });
    }
  } else {
    shakeTrigger.value++;
  }
  feedbackTrigger.value++;
};

const handleRestart = () => {
  resetGame();
};

const handleHome = () => {
  resetGame();
  viewingLeaderboard.value = false;
  // Reset config if needed, or keep it
};

const handleViewLeaderboard = () => {
  viewingLeaderboard.value = true;
};

const handleBackToSetup = () => {
  viewingLeaderboard.value = false;
};

// Watch for game end
watch(() => state.value.status, async (newStatus) => {
  if (newStatus === 'finished') {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    
    if (config.value.mode === 'ranked') {
      await submitScore({
        player_name: config.value.playerName,
        score: state.value.score,
        difficulty: config.value.difficulty,
        operation: config.value.operators[0] || '+',
      });
    }
  }
});
</script>

<template>
  <div class="min-h-screen bg-purple-50 font-sans text-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-grass-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-sun-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

    <Transition name="fade" mode="out-in">
      <SetupView 
        v-if="state.status === 'idle' && !viewingLeaderboard" 
        :config="config" 
        @start="handleStart"
        @view-leaderboard="handleViewLeaderboard" 
      />
      
      <LeaderboardView 
        v-else-if="viewingLeaderboard"
        :score="null"
        @home="handleBackToSetup"
      />
      
      <div v-else-if="state.status === 'playing'" class="w-full h-full flex items-center justify-center relative">
        <GameView 
          :state="state"
          :config="config"
          :shake-trigger="shakeTrigger"
          @input="handleInput"
          @back="endGame"
        />
        <FeedbackOverlay 
          :trigger="feedbackTrigger" 
          :type="feedbackType" 
          :score-delta="lastScoreDelta"
        />
      </div>

      <LeaderboardView 
        v-else-if="state.status === 'finished'"
        :score="state.score"
        @restart="handleRestart"
        @home="handleHome"
      />
    </Transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
