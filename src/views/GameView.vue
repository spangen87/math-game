<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Clock, Trophy, ArrowLeft, Settings, X, Calculator, Zap, Brain, Divide, HelpCircle } from 'lucide-vue-next';
import Numpad from '../components/Numpad.vue';
import VisualHint from '../components/VisualHint.vue';
import Pandis from '../components/Pandis.vue';
import type { GameState, GameConfig, Operator, Difficulty } from '../types';

const props = defineProps<{
  state: GameState;
  config: GameConfig;
  shakeTrigger?: number;
}>();

const emit = defineEmits<{
  (e: 'input', value: number): void;
  (e: 'back'): void;
}>();

const currentInput = ref<string>('');
const isShaking = ref(false);
const showSettings = ref(false);
const showHint = ref(false);
const pandisState = ref<'idle' | 'happy' | 'wrong'>('idle');

watch(() => props.state.currentProblem, () => {
  showHint.value = false;
  // If score increased, it was correct
  pandisState.value = 'happy';
  setTimeout(() => {
    pandisState.value = 'idle';
  }, 2000);
}, { flush: 'sync' });

// Watch for shake trigger from parent
watch(() => props.shakeTrigger, () => {
  isShaking.value = true;
  pandisState.value = 'wrong';
  setTimeout(() => {
    isShaking.value = false;
    pandisState.value = 'idle';
  }, 1000);
});

const hintText = computed(() => {
  const p = props.state.currentProblem;
  if (!p) return '';
  if (p.operator === '+') return `Tänk på att lägga ihop ${p.num1} och ${p.num2}`;
  if (p.operator === '-') return `Vad är skillnaden mellan ${p.num1} och ${p.num2}?`;
  if (p.operator === '×') return `${p.num1} stycken ${p.num2}:or`;
  if (p.operator === '÷') return `${p.num2} gånger vad blir ${p.num1}?`;
  return '';
});

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

const toggleOperator = (op: Operator) => {
  const index = props.config.operators.indexOf(op);
  if (index === -1) {
    props.config.operators.push(op);
  } else {
    if (props.config.operators.length > 1) {
      props.config.operators.splice(index, 1);
    }
  }
};

const showAnswer = () => {
  if (props.state.currentProblem) {
    currentInput.value = props.state.currentProblem.answer.toString();
  }
};
</script>


<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <div class="w-full max-w-md flex flex-col h-full relative">
    <!-- Settings Overlay -->
    <div v-if="showSettings" class="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 rounded-3xl p-6 flex flex-col gap-6 animate-fade-in">
      <div class="flex justify-between items-center">
        <h3 class="text-2xl font-bold text-slate-700">Inställningar</h3>
        <button @click="showSettings = false" class="p-2 hover:bg-slate-100 rounded-full">
          <X class="w-6 h-6 text-slate-500" />
        </button>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-slate-700">Räknesätt</label>
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="op in operators" 
            :key="op.value"
            @click="toggleOperator(op.value)"
            class="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-200"
            :class="config.operators.includes(op.value)
              ? 'bg-sky-100 border-sky-500 text-sky-700' 
              : 'bg-white border-slate-100 text-slate-400'"
          >
            <component :is="op.icon" class="w-5 h-5" />
            <span class="font-bold">{{ op.value }}</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-slate-700">Svårighetsgrad</label>
        <div class="grid grid-cols-3 gap-2">
          <button 
            v-for="diff in difficulties" 
            :key="diff.value"
            @click="config.difficulty = diff.value"
            class="py-2 rounded-xl border-2 font-bold transition-all duration-200"
            :class="config.difficulty === diff.value
              ? 'bg-grass-100 border-grass-500 text-grass-700'
              : 'bg-white border-slate-100 text-slate-400'"
          >
            {{ diff.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="flex justify-between items-center mb-2 md:mb-6 bg-white/50 p-2 md:p-4 rounded-2xl backdrop-blur-sm">
      <button @click="emit('back')" class="p-1.5 md:p-2 hover:bg-white/50 rounded-xl transition-colors">
        <ArrowLeft class="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
      </button>
      
      <template v-if="config.mode === 'ranked'">
        <div class="flex items-center gap-1.5 md:gap-2 text-sky-600 font-bold text-base md:text-xl">
          <Clock class="w-4 h-4 md:w-6 md:h-6" />
          <span>{{ state.timeLeft }}s</span>
        </div>

        <div class="flex items-center gap-1.5 md:gap-2 text-sun-600 font-bold text-base md:text-xl">
          <Trophy class="w-4 h-4 md:w-6 md:h-6" />
          <span>{{ state.score }}</span>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center gap-1 md:gap-2">
          <div class="text-sky-600 font-bold text-sm md:text-xl">Övningsläge</div>
          <button 
            @click="showHint = !showHint" 
            class="flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold text-xs md:text-sm hover:bg-yellow-200 transition-colors"
          >
            <HelpCircle class="w-3 h-3 md:w-4 md:h-4" />
            <span class="hidden sm:inline">{{ showHint ? 'Dölj' : 'Ledtråd' }}</span>
          </button>
          <button 
            @click="showAnswer" 
            class="flex items-center gap-0.5 md:gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs md:text-sm hover:bg-purple-200 transition-colors"
          >
            <HelpCircle class="w-3 h-3 md:w-4 md:h-4" />
            <span class="hidden sm:inline">Visa svar</span>
          </button>
        </div>
        <button @click="showSettings = true" class="p-1.5 md:p-2 hover:bg-white/50 rounded-xl transition-colors">
          <Settings class="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
        </button>
      </template>
    </div>

    <!-- Desktop Hint Overlay Backdrop -->
    <div v-if="showHint && config.mode === 'practice'" 
         class="hidden md:block absolute inset-0 bg-white/60 z-10 rounded-3xl backdrop-blur-sm cursor-pointer"
         @click="showHint = false">
    </div>

    <!-- Hint Display -->
    <div v-if="showHint && config.mode === 'practice'" class="mb-2 md:mb-0 w-full flex flex-col items-center gap-1.5 md:gap-2 animate-fade-in px-2 md:px-4 md:absolute md:top-24 md:left-0 md:z-20 pointer-events-none">
      <div class="pointer-events-auto inline-block bg-yellow-50 text-yellow-800 px-2.5 md:px-4 py-1 md:py-2 rounded-xl border border-yellow-200 font-medium text-[11px] md:text-sm shadow-sm">
        💡 {{ hintText }}
      </div>
      <div class="pointer-events-auto w-full">
        <VisualHint v-if="state.currentProblem" :problem="state.currentProblem" />
      </div>
    </div>

    <!-- Main Game Area -->
    <div class="flex-1 flex flex-col w-full min-h-0 justify-center gap-2 md:gap-4 pb-4 md:pb-0">
      
      <!-- Panda Area -->
      <div class="flex items-center justify-center py-2 md:py-4">
        <div class="relative scale-110 md:scale-100 transition-transform">
          <Pandis :state="pandisState" />
        </div>
      </div>

      <!-- Problem Box -->
      <div 
        class="shrink-0 text-3xl md:text-7xl font-bold text-slate-800 flex items-center gap-2 md:gap-4 p-4 md:p-8 bg-white rounded-3xl shadow-xl w-full justify-center transition-transform"
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

      <!-- Numpad -->
      <div class="shrink-0 w-full">
        <Numpad 
          @input="handleInput"
          @delete="handleDelete"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>
