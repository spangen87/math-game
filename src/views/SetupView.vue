<script setup lang="ts">
import { ref } from 'vue';
import { Play, GraduationCap, Swords, Trophy, CircleHelp } from 'lucide-vue-next';
import Pandis from '../components/Pandis.vue';
import OptionTile from '../components/OptionTile.vue';
import { displayOperator, operatorOptions, difficultyOptions } from '../labels';
import type { GameConfig, Operator, GameMode } from '../types';

const props = defineProps<{
  config: GameConfig;
}>();

const emit = defineEmits<{
  (e: 'start'): void;
  (e: 'view-leaderboard'): void;
  (e: 'view-rules'): void;
}>();

const modes: { value: GameMode; label: string; icon: any; description: string }[] = [
  { value: 'ranked', label: 'Tävling', icon: Swords, description: 'Tid och poäng' },
  { value: 'practice', label: 'Öva', icon: GraduationCap, description: 'Ingen stress' },
];

const localConfig = ref(props.config);
const nameError = ref('');

const toggleOperator = (op: Operator) => {
  const index = localConfig.value.operators.indexOf(op);
  if (index === -1) {
    localConfig.value.operators.push(op);
  } else {
    if (localConfig.value.operators.length > 1) {
      localConfig.value.operators.splice(index, 1);
    }
  }
};

const startGame = () => {
  if (!localConfig.value.playerName.trim()) {
    nameError.value = 'Skriv ditt namn för att starta.';
    return;
  }
  nameError.value = '';
  emit('start');
};
</script>

<template>
  <div class="ms-card w-full max-w-md max-h-full overflow-y-auto">
    <div class="flex items-center gap-3">
      <Pandis :size="64" :bubble="null" />
      <div class="flex-1 min-w-0">
        <h1 class="font-display text-ink text-[clamp(28px,7vw,36px)] leading-[1.05] font-semibold tracking-[-0.02em] text-balance m-0">
          Biancas Mattespel
        </h1>
        <p class="text-ink-muted text-sm mt-1 mb-0">Välj dina inställningar</p>
      </div>
      <button
        type="button"
        class="ms-btn ms-btn--ghost self-start"
        aria-label="Hur spelar man?"
        @click="emit('view-rules')"
      >
        <CircleHelp class="ms-icon" />
      </button>
    </div>

    <div class="ms-field" :class="{ 'ms-field--error': nameError }">
      <label class="ms-field__label" for="player-name">Spelarnamn</label>
      <input
        id="player-name"
        v-model="localConfig.playerName"
        type="text"
        class="ms-field__input"
        placeholder="Skriv ditt namn"
        autocomplete="off"
        :aria-invalid="nameError ? 'true' : undefined"
        :aria-describedby="nameError ? 'player-name-error' : undefined"
        @input="nameError = ''"
      />
      <div v-if="nameError" id="player-name-error" class="ms-field__error">{{ nameError }}</div>
    </div>

    <div class="ms-field" role="group" aria-label="Spelläge">
      <span class="ms-field__label" aria-hidden="true">Spelläge</span>
      <div class="ms-tiles" style="--ms-cols: 2">
        <OptionTile
          v-for="mode in modes"
          :key="mode.value"
          :label="mode.label"
          :description="mode.description"
          :icon="mode.icon"
          :selected="localConfig.mode === mode.value"
          @click="localConfig.mode = mode.value"
        />
      </div>
    </div>

    <div class="ms-field" role="group" aria-label="Räknesätt">
      <span class="ms-field__label" aria-hidden="true">Räknesätt (välj minst ett)</span>
      <div class="ms-tiles" style="--ms-cols: 4">
        <OptionTile
          v-for="op in operatorOptions"
          :key="op.value"
          :label="op.label"
          :symbol="displayOperator(op.value)"
          :selected="localConfig.operators.includes(op.value)"
          @click="toggleOperator(op.value)"
        />
      </div>
    </div>

    <div class="ms-field" role="group" aria-label="Svårighetsgrad">
      <span class="ms-field__label" aria-hidden="true">Svårighetsgrad</span>
      <div class="ms-tiles" style="--ms-cols: 3">
        <OptionTile
          v-for="diff in difficultyOptions"
          :key="diff.value"
          :label="diff.label"
          :selected="localConfig.difficulty === diff.value"
          @click="localConfig.difficulty = diff.value"
        />
      </div>
    </div>

    <div class="flex flex-col gap-3 pt-1">
      <button type="button" class="ms-btn ms-btn--primary ms-btn--block" @click="startGame">
        <Play class="ms-icon fill-current" />
        Starta spelet
      </button>

      <button type="button" class="ms-btn ms-btn--secondary ms-btn--block" @click="emit('view-leaderboard')">
        <Trophy class="ms-icon" />
        Se topplistan
      </button>
    </div>
  </div>
</template>
