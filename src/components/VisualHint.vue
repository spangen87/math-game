<script setup lang="ts">
import { computed } from 'vue';
import { Lightbulb } from 'lucide-vue-next';
import type { MathProblem } from '../types';
import { displayOperator } from '../labels';

const props = defineProps<{
  problem: MathProblem;
  text?: string;
}>();

const getParts = (n: number) => ({ tens: Math.floor(n / 10), ones: n % 10 });

const groups = computed(() => [
  { key: 'a', value: props.problem.num1, ...getParts(props.problem.num1) },
  { key: 'b', value: props.problem.num2, ...getParts(props.problem.num2) },
]);
</script>

<template>
  <div v-if="problem" class="ms-hint">
    <div v-if="text" class="ms-hint__text">
      <Lightbulb class="ms-icon" />
      <span>{{ text }}</span>
    </div>

    <div class="ms-hint__row">
      <template v-for="(group, i) in groups" :key="group.key">
        <span v-if="i === 1" class="ms-hint__op">{{ displayOperator(problem.operator) }}</span>
        <div class="ms-hint__group" role="img" :aria-label="String(group.value)">
          <span v-for="t in group.tens" :key="'t' + t" class="ms-bead ms-bead--ten">10</span>
          <span v-for="o in group.ones" :key="'o' + o" class="ms-bead ms-bead--one">1</span>
          <span v-if="group.tens === 0 && group.ones === 0" class="ms-hint__zero">0</span>
        </div>
      </template>
    </div>

    <div class="ms-hint__caption">Tiotal &amp; ental</div>
  </div>
</template>
