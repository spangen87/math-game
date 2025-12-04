<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Trophy, RotateCcw, Home } from 'lucide-vue-next';
import type { LeaderboardEntry } from '../types';
import { fetchLeaderboard } from '../services/leaderboard';

defineProps<{
  score: number;
}>();

const emit = defineEmits<{
  (e: 'restart'): void;
  (e: 'home'): void;
}>();

const leaderboard = ref<LeaderboardEntry[]>([]);
const loading = ref(true);

onMounted(async () => {
  leaderboard.value = await fetchLeaderboard();
  loading.value = false;
});
</script>

<template>
  <div class="card w-full max-w-md p-8 flex flex-col gap-6 animate-fade-in h-[80vh]">
    <div class="text-center">
      <Trophy class="w-16 h-16 text-sun-500 mx-auto mb-4 animate-bounce-short" />
      <h2 class="text-3xl font-bold text-sky-600 mb-2">Spelet är slut!</h2>
      <p class="text-slate-500 text-xl">Din poäng: <span class="font-bold text-sky-600">{{ score }}</span></p>
    </div>

    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      <h3 class="font-bold text-slate-700 mb-4 sticky top-0 bg-white/90 backdrop-blur-sm py-2">Topplista</h3>
      
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div 
          v-for="(entry, index) in leaderboard" 
          :key="index"
          class="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-100"
        >
          <div class="flex items-center gap-3">
            <span 
              class="w-8 h-8 flex items-center justify-center rounded-full font-bold text-white"
              :class="index === 0 ? 'bg-sun-500' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-600' : 'bg-sky-200 text-sky-700'"
            >
              {{ index + 1 }}
            </span>
            <div class="flex flex-col">
              <span class="font-bold text-slate-700">{{ entry.player_name }}</span>
              <span class="text-xs text-slate-400">{{ entry.difficulty }} • {{ entry.operation }}</span>
            </div>
          </div>
          <span class="font-bold text-sky-600">{{ entry.score }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 mt-auto">
      <button 
        @click="emit('restart')"
        class="btn-primary w-full flex items-center justify-center gap-2 text-xl"
      >
        <RotateCcw class="w-6 h-6" />
        Spela Igen
      </button>
      
      <button 
        @click="emit('home')"
        class="btn-secondary w-full flex items-center justify-center gap-2 text-xl"
      >
        <Home class="w-6 h-6" />
        Hem
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>
