<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  selected: boolean;
  label: string;
  // Shown big instead of the label (the operators); the label becomes the aria-label
  symbol?: string;
  description?: string;
  icon?: Component;
}>();
</script>

<template>
  <button
    type="button"
    class="ms-tile"
    :aria-pressed="selected ? 'true' : 'false'"
    :aria-label="symbol ? label : undefined"
  >
    <component :is="icon" v-if="icon" class="ms-icon" />
    <span v-if="symbol" class="ms-tile__symbol" aria-hidden="true">{{ symbol }}</span>
    <span v-else>{{ label }}</span>
    <span v-if="description" class="ms-tile__desc">{{ description }}</span>
  </button>
</template>
