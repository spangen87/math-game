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
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-purple-50">
    <h1 class="text-4xl md:text-6xl font-bold text-purple-600 mb-12 animate-bounce-in text-center px-4 drop-shadow-sm">
      Biancas Mattespel
    </h1>
    <div class="transform scale-150">
      <Pandis state="idle" :waving="true" />
    </div>
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
</style>
