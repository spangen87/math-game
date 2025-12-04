<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  state: 'idle' | 'happy' | 'wrong';
}>();

const isHappy = computed(() => props.state === 'happy');
const isWrong = computed(() => props.state === 'wrong');
</script>

<template>
  <div class="pandis-wrapper relative w-40 h-40 transition-transform duration-300" :class="{ 'scale-110': isHappy }">
    <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-2xl filter">
      <!-- Shadow -->
      <ellipse cx="100" cy="185" rx="60" ry="10" fill="#000" opacity="0.1" class="shadow-anim" />

      <!-- Main Group -->
      <g class="panda-body" :class="state">
        <!-- Legs -->
        <ellipse cx="65" cy="165" rx="22" ry="18" fill="#333" />
        <ellipse cx="135" cy="165" rx="22" ry="18" fill="#333" />
        
        <!-- Body -->
        <ellipse cx="100" cy="140" rx="65" ry="55" fill="white" />
        
        <!-- Arms -->
        <g class="arms">
          <path d="M 35 130 Q 20 150 45 160" stroke="#333" stroke-width="25" stroke-linecap="round" fill="none" class="arm-left origin-[45px_130px]" />
          <path d="M 165 130 Q 180 150 155 160" stroke="#333" stroke-width="25" stroke-linecap="round" fill="none" class="arm-right origin-[155px_130px]" />
        </g>

        <!-- Head Group -->
        <g class="head origin-[100px_140px]">
          <!-- Ears -->
          <circle cx="45" cy="55" r="22" fill="#333" />
          <circle cx="155" cy="55" r="22" fill="#333" />
          
          <!-- Face Shape -->
          <circle cx="100" cy="85" r="60" fill="white" />
          
          <!-- Eye Patches -->
          <ellipse cx="70" cy="80" rx="18" ry="24" fill="#333" transform="rotate(-15 70 80)" />
          <ellipse cx="130" cy="80" rx="18" ry="24" fill="#333" transform="rotate(15 130 80)" />
          
          <!-- Eyes -->
          <g class="eyes">
            <circle cx="74" cy="76" r="6" fill="white">
              <animate attributeName="cy" values="76;76;78;76" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="126" cy="76" r="6" fill="white">
              <animate attributeName="cy" values="76;76;78;76" dur="4s" repeatCount="indefinite" />
            </circle>
            <!-- Pupils -->
            <circle cx="74" cy="76" r="3" fill="#333" />
            <circle cx="126" cy="76" r="3" fill="#333" />
          </g>
          
          <!-- Nose -->
          <ellipse cx="100" cy="100" rx="12" ry="8" fill="#333" />
          
          <!-- Mouth -->
          <path d="M 90 115 Q 100 125 110 115" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />
          
          <!-- Cheeks (Happy) -->
          <g class="cheeks transition-opacity duration-300" :class="isHappy ? 'opacity-100' : 'opacity-0'">
            <circle cx="55" cy="105" r="12" fill="#ffb7b2" opacity="0.6" />
            <circle cx="145" cy="105" r="12" fill="#ffb7b2" opacity="0.6" />
          </g>
        </g>
      </g>
    </svg>
    
    <!-- Speech Bubble (Optional for later) -->
    <div v-if="isHappy" class="absolute -top-4 -right-4 bg-white px-3 py-1 rounded-xl rounded-bl-none shadow-lg border-2 border-sky-100 animate-bounce text-sm font-bold text-sky-600">
      Hurra! 🎉
    </div>
    <div v-if="isWrong" class="absolute -top-4 -right-4 bg-white px-3 py-1 rounded-xl rounded-bl-none shadow-lg border-2 border-berry-100 animate-pulse text-sm font-bold text-berry-600">
      Försök igen!
    </div>
  </div>
</template>

<style scoped>
/* Idle Animation */
.panda-body {
  animation: breathe 3s ease-in-out infinite;
  transform-origin: bottom center;
}

.head {
  animation: headBob 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.02); }
}

@keyframes headBob {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}

/* Happy Animation */
.happy .panda-body {
  animation: jump 0.6s cubic-bezier(0.25, 1.5, 0.5, 1) infinite;
}

.happy .arm-left {
  animation: waveLeft 0.6s ease-in-out infinite;
}

.happy .arm-right {
  animation: waveRight 0.6s ease-in-out infinite;
}

@keyframes jump {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-10px) scaleY(1.05); }
}

@keyframes waveLeft {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(40deg); }
}

@keyframes waveRight {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-40deg); }
}

/* Wrong Animation */
.wrong .head {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}
</style>
