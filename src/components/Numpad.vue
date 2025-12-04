<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Delete } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'input', value: number): void;
  (e: 'delete'): void;
  (e: 'submit'): void;
}>();

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key >= '0' && e.key <= '9') {
    emit('input', parseInt(e.key));
  } else if (e.key === 'Backspace') {
    emit('delete');
  } else if (e.key === 'Enter') {
    emit('submit');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-xs mx-auto">
    <button 
      v-for="key in keys" 
      :key="key"
      @click="emit('input', key)"
      class="bg-white text-sky-600 text-2xl md:text-3xl font-bold py-3 md:py-4 rounded-2xl shadow-md border-b-4 border-sky-100 active:border-b-0 active:translate-y-1 transition-all"
      :class="{ 'col-start-2': key === 0 }"
    >
      {{ key }}
    </button>
    
    <button 
      @click="emit('delete')"
      class="bg-berry-100 text-berry-600 flex items-center justify-center rounded-2xl shadow-md border-b-4 border-berry-200 active:border-b-0 active:translate-y-1 transition-all"
    >
      <Delete class="w-6 h-6 md:w-8 md:h-8" />
    </button>

    <button 
      @click="emit('submit')"
      class="col-span-3 bg-yellow-300 text-yellow-900 text-xl md:text-2xl font-bold py-3 md:py-4 rounded-2xl shadow-lg border-b-4 border-yellow-400 active:border-b-0 active:translate-y-1 transition-all mt-2 hover:bg-yellow-200"
    >
      Svara
    </button>
  </div>
</template>
