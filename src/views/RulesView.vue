<script setup lang="ts">
import { ArrowLeft, Swords, GraduationCap, Clock, Trophy, SkipForward, Lightbulb, Eye } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'home'): void;
}>();

const modes = [
  {
    title: 'Tävling',
    icon: Swords,
    tone: 'ms-tone-brand',
    text: 'Utmana dig själv! Du har 60 sekunder på dig att svara på så många frågor som möjligt.',
    points: [
      { icon: Clock, text: 'Tiden tickar ner från 60 sekunder' },
      { icon: Trophy, text: 'Få poäng för rätt svar. Svara rätt flera gånger i rad för bonus' },
      { icon: SkipForward, text: 'Du kan hoppa över 2 svåra frågor' },
    ],
  },
  {
    title: 'Öva',
    icon: GraduationCap,
    tone: 'ms-tone-sky',
    text: 'Ingen stress! Ta god tid på dig att lösa uppgifterna i din egen takt.',
    points: [
      { icon: Lightbulb, text: 'Få ledtrådar om du kör fast' },
      { icon: Eye, text: 'Se svaret om du vill lära dig' },
    ],
  },
];
</script>

<template>
  <div class="ms-card w-full max-w-md max-h-full overflow-y-auto">
    <div class="flex items-center gap-2">
      <button type="button" class="ms-btn ms-btn--ghost" aria-label="Tillbaka" @click="emit('home')">
        <ArrowLeft class="ms-icon" />
      </button>
      <h2 class="ms-card__title">Så här spelar du</h2>
    </div>

    <section
      v-for="mode in modes"
      :key="mode.title"
      class="flex flex-col gap-3 bg-surface-sunken rounded-[var(--radius-md)] p-4"
    >
      <div class="flex items-center gap-3">
        <span class="ms-stat p-0! w-10 h-10 justify-center shrink-0" :class="mode.tone">
          <component :is="mode.icon" class="ms-icon" />
        </span>
        <h3 class="font-display text-xl font-semibold text-ink m-0">{{ mode.title }}</h3>
      </div>
      <p class="m-0 text-ink leading-6">{{ mode.text }}</p>
      <ul class="m-0 p-0 list-none flex flex-col gap-2">
        <li v-for="point in mode.points" :key="point.text" class="flex items-start gap-2 text-sm leading-5 text-ink-muted">
          <component :is="point.icon" class="ms-icon w-[18px]! h-[18px]! mt-px text-ink" />
          <span>{{ point.text }}</span>
        </li>
      </ul>
    </section>

    <button type="button" class="ms-btn ms-btn--primary ms-btn--block" @click="emit('home')">
      <ArrowLeft class="ms-icon" />
      Tillbaka
    </button>
  </div>
</template>
