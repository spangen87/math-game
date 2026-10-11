<script setup lang="ts">
import { ref, watch } from 'vue';
import confetti from 'canvas-confetti';
import SplashScreen from './components/SplashScreen.vue';
import SetupView from './views/SetupView.vue';
import GameView from './views/GameView.vue';
import LeaderboardView from './views/LeaderboardView.vue';
import RulesView from './views/RulesView.vue';
import { useGameEngine } from './composables/useGameEngine';
import { submitScore } from './services/leaderboard';

const { config, state, startGame, endGame, checkAnswer, resetGame, skipProblem } = useGameEngine();

// Feedback state
const feedbackTrigger = ref(0);
const feedbackType = ref<'correct' | 'wrong'>('correct');
const lastScoreDelta = ref(10);
const viewingLeaderboard = ref(false);
const viewingRules = ref(false);
const showSplash = ref(true);

const handleSplashFinish = () => {
  showSplash.value = false;
};

const handleStart = () => {
  startGame();
};

// Confetti in the design system's brand, sky, grass and sun
const CONFETTI = ['#7b3fe4', '#0a8fd1', '#22c55e', '#facc15'];
const burst = (options: confetti.Options) => confetti({ disableForReducedMotion: true, ...options });

const handleInput = (val: number) => {
  // Same bonus as the engine: based on the streak before this answer
  const delta = 10 + Math.floor(state.value.streak / 3) * 5;
  const correct = checkAnswer(val);
  feedbackType.value = correct ? 'correct' : 'wrong';
  if (correct) {
    lastScoreDelta.value = delta;
    
    // Random confetti effect
    const effect = Math.floor(Math.random() * 4);
    
    if (effect === 0) {
      // Classic
      burst({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: CONFETTI
      });
    } else if (effect === 1) {
      // Stars
      burst({
        shapes: ['star'],
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
        particleCount: 20,
        spread: 70,
        origin: { y: 0.7 }
      });
    } else if (effect === 2) {
      // Side Cannons (School Pride style)
      burst({
        particleCount: 15,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#7b3fe4', '#0a8fd1']
      });
      burst({
        particleCount: 15,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#22c55e', '#facc15']
      });
    } else {
      // Burst (Fireworks)
      const randomX = Math.random() * 0.4 + 0.3; // 0.3 - 0.7
      burst({
        particleCount: 40,
        spread: 100,
        origin: { x: randomX, y: 0.6 },
        startVelocity: 30,
        gravity: 0.8,
        colors: CONFETTI
      });
    }
  }
  feedbackTrigger.value++;
};

const handleRestart = () => {
  resetGame();
};

const handleHome = () => {
  resetGame();
  viewingLeaderboard.value = false;
  viewingRules.value = false;
  // Reset config if needed, or keep it
};

const handleViewLeaderboard = () => {
  viewingLeaderboard.value = true;
};

const handleViewRules = () => {
  viewingRules.value = true;
};

const handleBackToSetup = () => {
  viewingLeaderboard.value = false;
  viewingRules.value = false;
};

const handleSkip = () => {
  skipProblem();
};

// Watch for game end
watch(() => state.value.status, async (newStatus) => {
  if (newStatus === 'finished') {
    burst({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: CONFETTI
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
  <div class="h-full w-full bg-bg font-sans text-ink flex items-center justify-center px-4 py-3 md:py-6 relative overflow-hidden">

    <Transition name="fade" mode="out-in">
      <SplashScreen 
        v-if="showSplash" 
        @finish="handleSplashFinish" 
      />

      <SetupView 
        v-else-if="state.status === 'idle' && !viewingLeaderboard && !viewingRules" 
        :config="config" 
        @start="handleStart"
        @view-leaderboard="handleViewLeaderboard" 
        @view-rules="handleViewRules"
      />
      
      <LeaderboardView 
        v-else-if="viewingLeaderboard"
        :score="null"
        @home="handleBackToSetup"
      />

      <RulesView 
        v-else-if="viewingRules"
        @home="handleBackToSetup"
      />
      
      <div v-else-if="state.status === 'playing'" class="w-full h-full flex items-center justify-center relative">
        <GameView 
          :state="state"
          :config="config"
          :feedback-trigger="feedbackTrigger"
          :feedback-type="feedbackType"
          :score-delta="lastScoreDelta"
          @input="handleInput"
          @back="endGame"
          @skip="handleSkip"
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
</style>
