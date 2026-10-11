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
  <div class="ms-numpad">
    <button
      v-for="key in keys"
      :key="key"
      type="button"
      class="ms-key"
      :class="{ 'ms-key--zero': key === 0 }"
      @click="emit('input', key)"
    >
      {{ key }}
    </button>

    <button type="button" class="ms-key ms-key--delete" aria-label="Radera" @click="emit('delete')">
      <Delete class="ms-icon" />
    </button>

    <button type="button" class="ms-btn ms-btn--primary ms-btn--block" @click="emit('submit')">
      Svara
    </button>
  </div>
</template>
