<script setup lang="ts">
import { ref } from 'vue';
import { Clock, Trophy, ArrowLeft } from 'lucide-vue-next';
import Numpad from '../components/Numpad.vue';
import type { GameState } from '../types';

defineProps<{
  state: GameState;
}>();

const emit = defineEmits<{
  (e: 'input', value: number): void;
  (e: 'back'): void;
}>();

const currentInput = ref<string>('');
const isShaking = ref(false);

const handleInput = (num: number) => {
  if (currentInput.value.length < 3) {
    currentInput.value += num.toString();
  }
};

const handleDelete = () => {
  currentInput.value = currentInput.value.slice(0, -1);
};

const handleSubmit = () => {
  if (!currentInput.value) return;
  
  const val = parseInt(currentInput.value);
  emit('input', val);
  currentInput.value = ''; // Clear input after submit
};
</script>


<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <div class="w-full max-w-md flex flex-col h-full max-h-[90vh]">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 bg-white/50 p-4 rounded-2xl backdrop-blur-sm">
      <button @click="emit('back')" class="p-2 hover:bg-white/50 rounded-xl transition-colors">
        <ArrowLeft class="w-6 h-6 text-slate-600" />
      </button>
      
      <div class="flex items-center gap-2 text-sky-600 font-bold text-xl">
        <Clock class="w-6 h-6" />
        <span>{{ state.timeLeft }}s</span>
      </div>

      <div class="flex items-center gap-2 text-sun-600 font-bold text-xl">
        <Trophy class="w-6 h-6" />
        <span>{{ state.score }}</span>
      </div>
    </div>

    <!-- Problem Display -->
    <div class="flex-1 flex flex-col items-center justify-center mb-8 relative">
      <div 
        class="text-7xl font-bold text-slate-800 flex items-center gap-4 p-8 bg-white rounded-3xl shadow-xl w-full justify-center transition-transform"
        :class="{ 'animate-shake border-4 border-berry-400': isShaking }"
      >
        <span class="text-sky-500">{{ state.currentProblem?.num1 }}</span>
        <span class="text-slate-400">{{ state.currentProblem?.operator }}</span>
        <span class="text-sky-500">{{ state.currentProblem?.num2 }}</span>
        <span class="text-slate-400">=</span>
        <span class="text-slate-800 min-w-[2ch] text-center border-b-4 border-slate-200">
          {{ currentInput || '?' }}
        </span>
      </div>
    </div>

    <!-- Numpad -->
    <Numpad 
      @input="handleInput"
      @delete="handleDelete"
      @submit="handleSubmit"
    />
  </div>
</template>
