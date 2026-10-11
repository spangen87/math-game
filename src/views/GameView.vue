<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Clock, Trophy, ArrowLeft, Settings, X, SkipForward, Lightbulb, Eye } from 'lucide-vue-next';
import Numpad from '../components/Numpad.vue';
import VisualHint from '../components/VisualHint.vue';
import Pandis from '../components/Pandis.vue';
import type { PandisMood } from '../components/Pandis.vue';
import OptionTile from '../components/OptionTile.vue';
import FeedbackOverlay from '../components/FeedbackOverlay.vue';
import { displayOperator, operatorOptions, difficultyOptions } from '../labels';
import type { GameState, GameConfig, Operator } from '../types';

const props = defineProps<{
  state: GameState;
  config: GameConfig;
  feedbackTrigger: number;
  feedbackType: 'correct' | 'wrong';
  scoreDelta: number;
}>();

const emit = defineEmits<{
  (e: 'input', value: number): void;
  (e: 'back'): void;
  (e: 'skip'): void;
}>();

const SLEEP_AFTER_MS = 20000;

const currentInput = ref<string>('');
const isShaking = ref(false);
const showSettings = ref(false);
const showHint = ref(false);

// Pandis
const pandisState = ref<PandisMood>('idle');
const pandisBubble = ref<string | null | undefined>(undefined);
const reacting = ref(false);
let reactionTimer: number | undefined;
let sleepTimer: number | undefined;

const restingMood = (): PandisMood => (showHint.value ? 'thinking' : 'idle');

const react = (mood: PandisMood, ms: number, bubble?: string | null) => {
  window.clearTimeout(reactionTimer);
  reacting.value = true;
  pandisState.value = mood;
  pandisBubble.value = bubble;
  reactionTimer = window.setTimeout(() => {
    reacting.value = false;
    pandisState.value = restingMood();
    pandisBubble.value = undefined;
  }, ms);
};

// Any input wakes Pandis; in practice mode Pandis dozes off after a while
const markActivity = () => {
  window.clearTimeout(sleepTimer);
  if (pandisState.value === 'sleeping') pandisState.value = restingMood();
  if (props.config.mode !== 'practice') return;
  sleepTimer = window.setTimeout(() => {
    if (!reacting.value && !showSettings.value) pandisState.value = 'sleeping';
  }, SLEEP_AFTER_MS);
};

onMounted(markActivity);
onUnmounted(() => {
  window.clearTimeout(reactionTimer);
  window.clearTimeout(sleepTimer);
});

watch(() => props.state.currentProblem, () => {
  showHint.value = false;
});

watch(showHint, () => {
  if (!reacting.value) pandisState.value = restingMood();
});

watch(() => props.feedbackTrigger, () => {
  markActivity();
  if (props.feedbackType === 'correct') {
    const streak = props.state.streak;
    if (props.config.mode === 'ranked' && streak > 0 && streak % 5 === 0) {
      react('cheer', 2200, `${streak} i rad!`);
    } else {
      react('happy', 1600);
    }
  } else {
    isShaking.value = true;
    window.setTimeout(() => {
      isShaking.value = false;
    }, 600);
    // The sticker already says "Försök igen!"
    react('wrong', 1200, null);
  }
});

const hintText = computed(() => {
  const p = props.state.currentProblem;
  if (!p) return '';
  if (p.operator === '+') return `Tänk på att lägga ihop ${p.num1} och ${p.num2}`;
  if (p.operator === '-') return `Vad är skillnaden mellan ${p.num1} och ${p.num2}?`;
  if (p.operator === '×') return `${p.num1} stycken ${p.num2}:or`;
  if (p.operator === '÷') return `${p.num2} gånger vad blir ${p.num1}?`;
  return '';
});

const lowTime = computed(() => props.state.timeLeft <= 10);
const skipsLeft = computed(() => 2 - props.state.skipsUsed);

const handleInput = (num: number) => {
  markActivity();
  if (currentInput.value.length < 3) {
    currentInput.value += num.toString();
  }
};

const handleDelete = () => {
  markActivity();
  currentInput.value = currentInput.value.slice(0, -1);
};

const handleSubmit = () => {
  if (!currentInput.value) return;

  const val = parseInt(currentInput.value);
  emit('input', val);
  currentInput.value = ''; // Clear input after submit
};

const toggleOperator = (op: Operator) => {
  const index = props.config.operators.indexOf(op);
  if (index === -1) {
    props.config.operators.push(op);
  } else {
    if (props.config.operators.length > 1) {
      props.config.operators.splice(index, 1);
    }
  }
};

const toggleHint = () => {
  markActivity();
  showHint.value = !showHint.value;
};

const showAnswer = () => {
  markActivity();
  if (props.state.currentProblem) {
    currentInput.value = props.state.currentProblem.answer.toString();
  }
};
</script>


<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <div class="w-full max-w-md h-full flex flex-col gap-3 relative">
    <!-- Settings (practice mode) -->
    <div v-if="showSettings" class="absolute inset-0 z-40 flex items-start justify-center pt-2 bg-bg/90">
      <div class="ms-card w-full" style="box-shadow: var(--shadow-lg)">
        <div class="flex items-center justify-between">
          <h2 class="ms-card__title">Inställningar</h2>
          <button type="button" class="ms-btn ms-btn--ghost" aria-label="Stäng" @click="showSettings = false">
            <X class="ms-icon" />
          </button>
        </div>

        <div class="ms-field" role="group" aria-label="Räknesätt">
          <span class="ms-field__label" aria-hidden="true">Räknesätt (välj minst ett)</span>
          <div class="ms-tiles" style="--ms-cols: 4">
            <OptionTile
              v-for="op in operatorOptions"
              :key="op.value"
              :label="op.label"
              :symbol="displayOperator(op.value)"
              :selected="config.operators.includes(op.value)"
              @click="toggleOperator(op.value)"
            />
          </div>
        </div>

        <div class="ms-field" role="group" aria-label="Svårighetsgrad">
          <span class="ms-field__label" aria-hidden="true">Svårighetsgrad</span>
          <div class="ms-tiles" style="--ms-cols: 3">
            <OptionTile
              v-for="diff in difficultyOptions"
              :key="diff.value"
              :label="diff.label"
              :selected="config.difficulty === diff.value"
              @click="config.difficulty = diff.value"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Top bar -->
    <div class="ms-bar flex-nowrap">
      <button type="button" class="ms-btn ms-btn--ghost" aria-label="Avsluta spelet" @click="emit('back')">
        <ArrowLeft class="ms-icon" />
      </button>

      <template v-if="config.mode === 'ranked'">
        <div class="ms-stat" :class="lowTime ? 'ms-tone-berry' : 'ms-tone-sky'">
          <Clock class="ms-icon" />
          <span class="ms-sr">Tid kvar: </span>
          <span>{{ state.timeLeft }} s</span>
        </div>
        <div class="ms-stat ms-tone-sun">
          <Trophy class="ms-icon" />
          <span class="ms-sr">Poäng: </span>
          <span>{{ state.score }}</span>
        </div>

        <span class="ms-bar__spacer"></span>

        <button
          type="button"
          class="ms-btn ms-btn--soft ms-tone-berry"
          :disabled="skipsLeft <= 0"
          :aria-label="`Hoppa över, ${skipsLeft} kvar`"
          @click="emit('skip')"
        >
          <SkipForward class="ms-icon" />
          <span class="hidden min-[420px]:inline">Hoppa över</span>
          <span class="ms-count">{{ skipsLeft }}</span>
        </button>
      </template>

      <template v-else>
        <span class="hidden md:inline font-display text-xl font-semibold text-ink-muted">Övningsläge</span>
        <span class="ms-bar__spacer"></span>

        <button type="button" class="ms-btn ms-btn--soft ms-tone-sun" :aria-pressed="showHint" @click="toggleHint">
          <Lightbulb class="ms-icon" />
          <span>{{ showHint ? 'Dölj' : 'Ledtråd' }}</span>
        </button>

        <button type="button" class="ms-btn ms-btn--soft ms-tone-brand" @click="showAnswer">
          <Eye class="ms-icon" />
          <span>Svar</span>
        </button>

        <button type="button" class="ms-btn ms-btn--ghost" aria-label="Inställningar" @click="showSettings = true">
          <Settings class="ms-icon" />
        </button>
      </template>
    </div>

    <!-- Pandis, or Pandis thinking next to the hint. The sticker pops up between Pandis and the problem -->
    <div class="flex-1 min-h-0 flex items-center justify-center relative">
      <div v-if="showHint && config.mode === 'practice' && state.currentProblem" class="w-full flex items-start gap-2">
        <Pandis :state="pandisState" :trigger="feedbackTrigger" :bubble="null" :size="72" class="mt-2" />
        <VisualHint :problem="state.currentProblem" :text="hintText" class="flex-1 min-w-0" />
      </div>
      <Pandis
        v-else
        :state="pandisState"
        :trigger="feedbackTrigger"
        :bubble="pandisBubble"
        size="clamp(96px, 22dvh, 160px)"
      />
      <FeedbackOverlay
        :trigger="feedbackTrigger"
        :type="feedbackType"
        :score-delta="scoreDelta"
        :message="config.mode === 'practice' ? 'Rätt!' : undefined"
      />
    </div>

    <!-- Problem -->
    <div
      v-if="state.currentProblem"
      class="ms-problem shrink-0"
      :class="{ 'ms-problem--wrong': isShaking }"
      role="group"
      aria-label="Uppgift"
    >
      <span>{{ state.currentProblem.num1 }}</span>
      <span class="ms-problem__op">{{ displayOperator(state.currentProblem.operator) }}</span>
      <span>{{ state.currentProblem.num2 }}</span>
      <span class="ms-problem__op">=</span>
      <span class="ms-problem__answer" aria-live="polite">{{ currentInput || '?' }}</span>
    </div>

    <!-- Numpad -->
    <div class="shrink-0 w-full pb-1">
      <Numpad
        @input="handleInput"
        @delete="handleDelete"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
