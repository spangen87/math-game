<script setup lang="ts">
import { computed, ref, watch } from 'vue';

export type PandisMood = 'idle' | 'happy' | 'wrong' | 'thinking' | 'sleeping' | 'cheer';

const props = withDefaults(defineProps<{
  state?: PandisMood;
  waving?: boolean;
  // happy: 1 hoppar, 2 vickar, 3 klappar, 4 dansar, 5 volt · wrong: 1 skakar, 2 lutar, 3 kliar sig
  variant?: number;
  // Öka vid varje svar så att Pandis reagerar igen i samma humör
  trigger?: number;
  // null döljer bubblan
  bubble?: string | null;
  size?: number | string;
}>(), {
  state: 'idle',
  waving: false,
  trigger: 0,
  size: 160,
});

const VARIANTS: Partial<Record<PandisMood, number>> = { happy: 5, wrong: 3 };
const BUBBLES: Partial<Record<PandisMood, string>> = { happy: 'Hurra!', wrong: 'Försök igen!', thinking: 'Hmm…' };
const STAR = 'M0 -9 Q1.6 -1.6 9 0 Q1.6 1.6 0 9 Q-1.6 1.6 -9 0 Q-1.6 -1.6 0 -9 Z';
const SPARKS = [[22, 40, 1.8], [178, 30, 1.4], [10, 116, 1.2], [190, 100, 1.6]];
const ZS = [[118, 16, 18], [134, -2, 24], [152, -22, 30]];

// Pick a new movement on every reaction, never the same one twice in a row
const picked = ref(1);
watch(() => [props.state, props.trigger], () => {
  const count = VARIANTS[props.state] ?? 1;
  if (count < 2) return;
  let next = picked.value;
  while (next === picked.value) next = 1 + Math.floor(Math.random() * count);
  picked.value = next;
}, { immediate: true });

const variant = computed(() => props.variant ?? picked.value);
const isGlad = computed(() => props.state === 'happy' || props.state === 'cheer');
const eyes = computed(() => isGlad.value ? 'happy' : props.state === 'sleeping' ? 'closed' : 'round');
const mouth = computed(() => {
  if (isGlad.value) return 'open';
  if (props.state === 'sleeping') return 'o';
  if (props.state === 'wrong') return 'wobbly';
  if (props.state === 'thinking') return 'side';
  return 'smile';
});
const mouthPath = computed(() => ({
  wobbly: 'M 91 119 Q 95.5 115 100 119 Q 104.5 123 109 119',
  side: 'M 93 118 Q 102 121 109 115',
  smile: 'M 90 115 Q 100 125 110 115',
}[mouth.value as 'wobbly' | 'side' | 'smile']));
const bubbleText = computed(() => props.bubble !== undefined ? props.bubble : (BUBBLES[props.state] ?? null));
const sizeStyle = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return { width: s, height: s };
});
const classes = computed(() => [
  'ms-panda',
  `ms-panda--${props.state}`,
  `ms-panda--v${variant.value}`,
  {
    'ms-panda--glad': isGlad.value,
    'ms-panda--waving': props.waving,
    'ms-panda--cheeks': isGlad.value || props.state === 'sleeping' || props.waving,
  },
]);
</script>

<template>
  <div :class="classes" :style="sizeStyle" role="img" aria-label="Pandis, spelets panda">
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <ellipse class="p-shadow" cx="100" cy="185" rx="60" ry="10" />

      <g class="p-body">
        <ellipse class="p-fur" cx="100" cy="140" rx="65" ry="55" />

        <!-- Legs (sitting in front) -->
        <g>
          <g v-for="x in [65, 135]" :key="x" :transform="`translate(${x}, 175)`">
            <ellipse class="p-ink" cx="0" cy="0" rx="22" ry="18" />
            <ellipse class="p-pad" cx="0" cy="4" rx="10" ry="8" />
            <circle class="p-pad" cx="-12" cy="-8" r="4" />
            <circle class="p-pad" cx="0" cy="-12" r="4" />
            <circle class="p-pad" cx="12" cy="-8" r="4" />
          </g>
        </g>

        <!-- Arms -->
        <g>
          <path class="p-limb p-arm-left" d="M 35 130 Q 20 150 45 160" stroke-width="25" />
          <path class="p-limb p-arm-right" d="M 165 130 Q 180 150 155 160" stroke-width="25" />
        </g>

        <g class="p-head">
          <g class="p-ear-left"><circle class="p-ink" cx="45" cy="55" r="22" /></g>
          <g class="p-ear-right"><circle class="p-ink" cx="155" cy="55" r="22" /></g>

          <circle class="p-fur" cx="100" cy="85" r="60" />

          <!-- Eye patches -->
          <ellipse class="p-ink" cx="70" cy="80" rx="18" ry="24" transform="rotate(-15 70 80)" />
          <ellipse class="p-ink" cx="130" cy="80" rx="18" ry="24" transform="rotate(15 130 80)" />

          <g v-if="eyes === 'round'" class="p-eyes">
            <circle class="p-fur" cx="74" cy="76" r="6" />
            <circle class="p-fur" cx="126" cy="76" r="6" />
            <g class="p-pupils">
              <circle class="p-ink" cx="74" cy="76" r="3" />
              <circle class="p-ink" cx="126" cy="76" r="3" />
            </g>
          </g>
          <g v-else-if="eyes === 'happy'">
            <path class="p-glint" d="M 67 80 Q 74 71 81 80" />
            <path class="p-glint" d="M 119 80 Q 126 71 133 80" />
          </g>
          <g v-else>
            <path class="p-glint" d="M 67 76 Q 74 82 81 76" />
            <path class="p-glint" d="M 119 76 Q 126 82 133 76" />
          </g>

          <!-- Nose -->
          <ellipse class="p-ink" cx="100" cy="100" rx="12" ry="8" />

          <!-- Mouth -->
          <g v-if="mouth === 'open'">
            <path class="p-ink" d="M 89 113 Q 100 131 111 113 Z" />
            <path class="p-blush" d="M 95 119.5 Q 100 117 105 119.5 Q 100 124 95 119.5 Z" />
          </g>
          <ellipse v-else-if="mouth === 'o'" class="p-ink" cx="100" cy="118" rx="3.5" ry="4.5" />
          <path v-else class="p-limb" :d="mouthPath" stroke-width="3" />

          <g class="p-cheeks">
            <circle class="p-blush" cx="55" cy="105" r="12" opacity="0.6" />
            <circle class="p-blush" cx="145" cy="105" r="12" opacity="0.6" />
          </g>
        </g>
      </g>

      <g v-if="state === 'cheer'">
        <g v-for="(s, i) in SPARKS" :key="i" class="p-spark" :transform="`translate(${s[0]} ${s[1]}) scale(${s[2]})`">
          <path :d="STAR" />
        </g>
      </g>

      <g v-if="state === 'sleeping'">
        <text v-for="(z, i) in ZS" :key="i" class="p-z" :x="z[0]" :y="z[1]" :font-size="z[2]">z</text>
      </g>
    </svg>

    <div
      v-if="bubbleText"
      :key="`${state}-${trigger}`"
      class="ms-panda__bubble"
      :class="`ms-panda__bubble--${state}`"
      aria-hidden="true"
    >
      {{ bubbleText }}
    </div>
  </div>
</template>
