<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  trigger: number; // Increment to trigger animation
  type: 'correct' | 'wrong';
  scoreDelta?: number;
}>();

const show = ref(false);

watch(() => props.trigger, () => {
  show.value = true;
  setTimeout(() => {
    show.value = false;
  }, 800);
});
</script>

<template>
  <Transition name="pop">
    <div 
      v-if="show"
      class="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div 
        class="text-6xl font-black drop-shadow-lg transform"
        :class="type === 'correct' ? 'text-grass-500' : 'text-berry-500'"
      >
        {{ type === 'correct' ? `+${scoreDelta}` : 'Försök igen!' }}
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}

.pop-leave-to {
  opacity: 0;
  transform: scale(1.5) translateY(-50px);
}
</style>
