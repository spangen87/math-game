<script setup lang="ts">
import { ref } from 'vue';
import { Play, Calculator, Zap, Brain } from 'lucide-vue-next';
import type { GameConfig, Operator, Difficulty } from '../types';

const props = defineProps<{
  config: GameConfig;
}>();

const emit = defineEmits<{
  (e: 'start'): void;
}>();

const operators: { value: Operator; label: string; icon: any }[] = [
  { value: '+', label: 'Addition', icon: Calculator },
  { value: '-', label: 'Subtraktion', icon: Zap },
  { value: '×', label: 'Multiplikation', icon: Brain },
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'Easy', label: 'Lätt' },
  { value: 'Medium', label: 'Medel' },
  { value: 'Hard', label: 'Svår' },
];

const localConfig = ref(props.config);

const startGame = () => {
  if (!localConfig.value.playerName.trim()) {
    alert('Vänligen skriv ditt namn!');
    return;
  }
  emit('start');
};
</script>

<template>
  <div class="card w-full max-w-md p-8 flex flex-col gap-8 animate-fade-in">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-sky-600 mb-2">Nytt Spel</h2>
      <p class="text-slate-500">Välj dina inställningar!</p>
    </div>

    <!-- Name Input -->
    <div class="flex flex-col gap-2">
      <label class="font-bold text-slate-700">Spelarnamn</label>
      <input 
        v-model="localConfig.playerName"
        type="text" 
        placeholder="Skriv ditt namn"
        class="w-full px-4 py-3 rounded-xl border-2 border-sky-100 focus:border-sky-400 focus:outline-none text-lg transition-colors"
      />
    </div>

    <!-- Operator Selection -->
    <div class="flex flex-col gap-2">
      <label class="font-bold text-slate-700">Räknesätt</label>
      <div class="grid grid-cols-3 gap-3">
        <button 
          v-for="op in operators" 
          :key="op.value"
          @click="localConfig.operator = op.value"
          class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200"
          :class="localConfig.operator === op.value 
            ? 'bg-sky-100 border-sky-500 text-sky-700 scale-105' 
            : 'bg-white border-slate-100 text-slate-400 hover:border-sky-200'"
        >
          <component :is="op.icon" class="w-6 h-6" />
          <span class="font-bold text-xl">{{ op.value }}</span>
        </button>
      </div>
    </div>

    <!-- Difficulty Selection -->
    <div class="flex flex-col gap-2">
      <label class="font-bold text-slate-700">Svårighetsgrad</label>
      <div class="grid grid-cols-3 gap-3">
        <button 
          v-for="diff in difficulties" 
          :key="diff.value"
          @click="localConfig.difficulty = diff.value"
          class="py-3 rounded-xl border-2 font-bold transition-all duration-200"
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
      class="btn-primary w-full flex items-center justify-center gap-2 text-xl mt-4"
    >
      <Play class="w-6 h-6 fill-current" />
      Starta Spelet
    </button>
  </div>
</template>
