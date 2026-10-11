<script setup lang="ts">
import { onMounted } from 'vue';
import Pandis from './Pandis.vue';

const emit = defineEmits(['finish']);

onMounted(() => {
  setTimeout(() => {
    emit('finish');
  }, 3000); // 3 seconds splash
});
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-12 bg-bg px-4">
    <h1 class="font-display text-ink text-center text-[clamp(36px,10vw,56px)] leading-none font-semibold tracking-[-0.02em] text-balance animate-bounce-in">
      Biancas Mattespel
    </h1>
    <Pandis :waving="true" :bubble="'Hej!'" :size="240" />
  </div>
</template>

<style scoped>
.animate-bounce-in {
  animation: bounceIn 1s cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-bounce-in {
    animation: none;
  }
}
</style>
