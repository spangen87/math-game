<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  trigger: number; // Increment to trigger animation
  type: 'correct' | 'wrong';
  scoreDelta?: number;
  // Shown instead of +poäng, e.g. "Rätt!" in practice mode
  message?: string;
}>();

const show = ref(false);
let hideTimer: number | undefined;

watch(() => props.trigger, () => {
  show.value = false;
  window.clearTimeout(hideTimer);
  // Restart the pop on the next frame so quick answers animate too
  requestAnimationFrame(() => {
    show.value = true;
    hideTimer = window.setTimeout(() => {
      show.value = false;
    }, 800);
  });
});

const text = computed(() => {
  if (props.type === 'wrong') return 'Försök igen!';
  return props.message ?? `+${props.scoreDelta ?? 10}`;
});
</script>

<template>
  <div class="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-30">
    <div
      v-if="show"
      class="ms-feedback ms-feedback--pop"
      :class="type === 'correct' ? 'ms-feedback--correct' : 'ms-feedback--wrong'"
      role="status"
    >
      {{ text }}
    </div>
  </div>
</template>
