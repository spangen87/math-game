<script setup lang="ts">
import { ref } from 'vue';
import { Play, Calculator, Zap, Brain, Divide, GraduationCap, Swords, Trophy } from 'lucide-vue-next';
import type { GameConfig, Operator, Difficulty, GameMode } from '../types';

const props = defineProps<{
  config: GameConfig;
}>();

const emit = defineEmits<{
  (e: 'start'): void;
  (e: 'view-leaderboard'): void;
}>();

const operators: { value: Operator; label: string; icon: any }[] = [
  { value: '+', label: 'Addition', icon: Calculator },
  { value: '-', label: 'Subtraktion', icon: Zap },
  { value: '×', label: 'Multiplikation', icon: Brain },
  { value: '÷', label: 'Division', icon: Divide },
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'Easy', label: 'Lätt' },
  { value: 'Medium', label: 'Medel' },
  { value: 'Hard', label: 'Svår' },
];

const modes: { value: GameMode; label: string; icon: any; description: string }[] = [
  { value: 'ranked', label: 'Tävling', icon: Swords, description: 'Tid och poäng' },
  { value: 'practice', label: 'Öva', icon: GraduationCap, description: 'Ingen stress' },
];

const localConfig = ref(props.config);

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
    alert('Vänligen skriv ditt namn!');
    return;
  }
  emit('start');
};
</script>

<template>
  <div class="card w-full max-w-md p-4 md:p-8 flex flex-col gap-3 md:gap-4 animate-fade-in overflow-y-auto max-h-[90dvh]">
    <div class="text-center">
      <h2 class="text-2xl md:text-3xl font-bold text-sky-600 mb-1 md:mb-2">Biancas Mattespel</h2>
      <p class="text-sm md:text-base text-slate-500">Välj dina inställningar!</p>
    </div>

    <!-- Name Input -->
    <div class="flex flex-col gap-2">
      <label class="font-bold text-slate-700 text-sm md:text-base">Spelarnamn</label>
      <input 
        v-model="localConfig.playerName"
        type="text" 
        placeholder="Skriv ditt namn"
        class="w-full px-4 py-2 md:py-3 rounded-xl border-2 border-sky-100 focus:border-sky-400 focus:outline-none text-base md:text-lg transition-colors"
      />
    </div>

    <!-- Game Mode Selection -->
    <div class="flex flex-col gap-2">
      <label class="font-bold text-slate-700 text-sm md:text-base">Spelläge</label>
      <div class="grid grid-cols-2 gap-2 md:gap-3">
        <button 
          v-for="mode in modes" 
          :key="mode.value"
          @click="localConfig.mode = mode.value"
          class="flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 rounded-xl border-2 transition-all duration-200"
          :class="localConfig.mode === mode.value 
            ? 'bg-purple-100 border-purple-500 text-purple-700 scale-105' 
            : 'bg-white border-slate-100 text-slate-400 hover:border-purple-200'"
        >
          <component :is="mode.icon" class="w-5 h-5 md:w-6 md:h-6" />
          <div class="flex flex-col items-center">
            <span class="font-bold text-base md:text-lg">{{ mode.label }}</span>
            <span class="text-[10px] md:text-xs opacity-75">{{ mode.description }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Operator Selection -->
    <div class="flex flex-col gap-2">
      <label class="font-bold text-slate-700 text-sm md:text-base">Räknesätt (Välj minst en)</label>
      <div class="grid grid-cols-4 gap-2">
        <button 
          v-for="op in operators" 
          :key="op.value"
          @click="toggleOperator(op.value)"
          class="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 rounded-xl border-2 transition-all duration-200"
          :class="localConfig.operators.includes(op.value)
            ? 'bg-sky-100 border-sky-500 text-sky-700 scale-105' 
            : 'bg-white border-slate-100 text-slate-400 hover:border-sky-200'"
        >
          <component :is="op.icon" class="w-4 h-4 md:w-5 md:h-5" />
          <span class="font-bold text-base md:text-lg">{{ op.value }}</span>
        </button>
      </div>
    </div>

    <!-- Difficulty Selection -->
    <div class="flex flex-col gap-2">
      <label class="font-bold text-slate-700 text-sm md:text-base">Svårighetsgrad</label>
      <div class="grid grid-cols-3 gap-2 md:gap-3">
        <button 
          v-for="diff in difficulties" 
          :key="diff.value"
          @click="localConfig.difficulty = diff.value"
          class="py-2 md:py-3 rounded-xl border-2 font-bold text-sm md:text-base transition-all duration-200"
          :class="localConfig.difficulty === diff.value
            ? 'bg-grass-100 border-grass-500 text-grass-700 scale-105'
            : 'bg-white border-slate-100 text-slate-400 hover:border-grass-200'"
        >
          {{ diff.label }}
        </button>
      </div>
    </div>

    <button 
      @click="startGame"
      class="btn-primary w-full flex items-center justify-center gap-2 text-lg md:text-xl mt-2 py-3 md:py-4"
    >
      <Play class="w-5 h-5 md:w-6 md:h-6 fill-current" />
      Starta Spelet
    </button>
    
    <button 
      @click="emit('view-leaderboard')"
      class="btn-secondary w-full flex items-center justify-center gap-2 text-base md:text-lg py-2 md:py-3"
    >
      <Trophy class="w-5 h-5 md:w-6 md:h-6" />
      Se Topplistan
    </button>
  </div>
</template>
