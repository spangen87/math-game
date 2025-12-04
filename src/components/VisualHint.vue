<script setup lang="ts">
import { computed } from 'vue';
import type { MathProblem } from '../types';

const props = defineProps<{
  problem: MathProblem;
}>();

const getParts = (n: number) => {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return { tens, ones };
};

const num1Parts = computed(() => getParts(props.problem.num1));
const num2Parts = computed(() => getParts(props.problem.num2));
</script>

<template>
  <div v-if="problem" class="flex flex-col items-center gap-2 md:gap-4 p-2 md:p-4 bg-white/80 rounded-2xl border-2 border-sky-100 w-full animate-fade-in">
    <div class="flex flex-row items-center gap-2 md:gap-4 justify-center w-full">
      
      <!-- First Number (Visualized) -->
      <div class="flex flex-wrap gap-1 md:gap-2 justify-center content-center p-2 md:p-4 bg-white rounded-xl border-2 border-sky-100 min-w-[80px] md:min-w-[120px] min-h-[60px] md:min-h-[100px] flex-1 max-w-[40%] md:max-w-[45%] shadow-sm">
        <!-- Tens -->
        <div 
          v-for="t in num1Parts.tens" 
          :key="'t1'+t"
          class="w-8 h-8 md:w-12 md:h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm md:text-lg shadow-sm border-b-2 md:border-b-4 border-sky-600"
        >
          10
        </div>
        <!-- Ones -->
        <div 
          v-for="o in num1Parts.ones" 
          :key="'o1'+o"
          class="w-5 h-5 md:w-8 md:h-8 rounded-full bg-pink-400 text-white flex items-center justify-center font-bold text-[10px] md:text-sm shadow-sm border-b-2 md:border-b-4 border-pink-500 self-center"
        >
          1
        </div>
        
        <div v-if="num1Parts.tens === 0 && num1Parts.ones === 0" class="text-slate-300 font-bold text-base md:text-xl">
            0
        </div>
      </div>

      <!-- Operator -->
      <div class="text-slate-400 font-bold text-xl md:text-3xl flex-shrink-0">
        {{ problem.operator }}
      </div>

      <!-- Second Number (Visualized) -->
      <div class="flex flex-wrap gap-1 md:gap-2 justify-center content-center p-2 md:p-4 bg-white rounded-xl border-2 border-sky-100 min-w-[80px] md:min-w-[120px] min-h-[60px] md:min-h-[100px] flex-1 max-w-[40%] md:max-w-[45%] shadow-sm">
        <!-- Tens -->
        <div 
          v-for="t in num2Parts.tens" 
          :key="'t2'+t"
          class="w-8 h-8 md:w-12 md:h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm md:text-lg shadow-sm border-b-2 md:border-b-4 border-sky-600"
        >
          10
        </div>
        <!-- Ones -->
        <div 
          v-for="o in num2Parts.ones" 
          :key="'o2'+o"
          class="w-5 h-5 md:w-8 md:h-8 rounded-full bg-pink-400 text-white flex items-center justify-center font-bold text-[10px] md:text-sm shadow-sm border-b-2 md:border-b-4 border-pink-500 self-center"
        >
          1
        </div>
        
        <div v-if="num2Parts.tens === 0 && num2Parts.ones === 0" class="text-slate-300 font-bold text-base md:text-xl">
            0
        </div>
      </div>

    </div>
    
    <div class="text-slate-400 text-[9px] md:text-xs font-medium uppercase tracking-wider">
      Tiotal & Ental
    </div>
  </div>
</template>
