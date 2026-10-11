<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Trophy, RotateCcw, House } from 'lucide-vue-next';
import Pandis from '../components/Pandis.vue';
import type { PandisMood } from '../components/Pandis.vue';
import type { LeaderboardEntry } from '../types';
import { fetchLeaderboard } from '../services/leaderboard';
import { difficultyLabels, displayOperator } from '../labels';

const props = defineProps<{
  score?: number | null;
}>();

const emit = defineEmits<{
  (e: 'restart'): void;
  (e: 'home'): void;
}>();

const leaderboard = ref<LeaderboardEntry[]>([]);
const loading = ref(true);
const isResult = props.score !== null && props.score !== undefined;

// Pandis cheers for the finished game, then settles down
const pandisState = ref<PandisMood>(isResult ? 'cheer' : 'idle');
let calmTimer: number | undefined;

onMounted(async () => {
  if (isResult) {
    calmTimer = window.setTimeout(() => {
      pandisState.value = 'idle';
    }, 3000);
  }
  leaderboard.value = await fetchLeaderboard();
  loading.value = false;
});

onUnmounted(() => window.clearTimeout(calmTimer));

const rankClass = (index: number) => (index < 3 ? `ms-rank--${index + 1}` : '');
const meta = (entry: LeaderboardEntry) =>
  [difficultyLabels[entry.difficulty] ?? entry.difficulty, entry.operation && displayOperator(entry.operation)]
    .filter(Boolean)
    .join(' · ');
</script>

<template>
  <div class="ms-card w-full max-w-md h-full max-h-[760px] min-h-0">
    <div v-if="isResult" class="flex flex-col items-center gap-2 text-center pt-8">
      <Pandis :state="pandisState" :bubble="pandisState === 'cheer' ? 'Bra kämpat!' : null" :size="120" />
      <h2 class="ms-card__title mt-2">Spelet är slut!</h2>
      <p class="m-0 text-ink-muted text-lg">
        Din poäng: <span class="font-display text-[28px] font-semibold text-brand tabular-nums align-[-2px]">{{ score }}</span>
      </p>
    </div>

    <div v-else class="flex items-center gap-3">
      <span class="ms-stat ms-tone-sun p-0! w-12 h-12 justify-center shrink-0">
        <Trophy class="ms-icon" />
      </span>
      <div>
        <h2 class="ms-card__title">Topplista</h2>
        <p class="m-0 text-ink-muted text-sm">De bästa resultaten hittills</p>
      </div>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto -mx-1 px-1 custom-scrollbar">
      <h3 class="ms-field__label sticky top-0 bg-surface py-2 m-0 z-10">Alla resultat</h3>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-[3px] border-brand-soft border-t-brand" role="status" aria-label="Laddar"></div>
      </div>

      <div v-else class="ms-ranklist">
        <div v-for="(entry, index) in leaderboard" :key="index" class="ms-rank-row">
          <span class="ms-rank" :class="rankClass(index)">{{ index + 1 }}</span>
          <div class="ms-rank-row__who">
            <span class="ms-rank-row__name">{{ entry.player_name }}</span>
            <span class="ms-rank-row__meta">{{ meta(entry) }}</span>
          </div>
          <span class="ms-rank-row__score">{{ entry.score }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <button v-if="isResult" type="button" class="ms-btn ms-btn--primary ms-btn--block" @click="emit('restart')">
        <RotateCcw class="ms-icon" />
        Spela igen
      </button>

      <button type="button" class="ms-btn ms-btn--secondary ms-btn--block" @click="emit('home')">
        <House class="ms-icon" />
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
  background-color: var(--line);
  border-radius: 20px;
}
</style>
