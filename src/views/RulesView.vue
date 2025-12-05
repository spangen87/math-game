<script setup lang="ts">
import { ArrowLeft, Swords, GraduationCap, Clock, Trophy, SkipForward, Lightbulb, Eye } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'home'): void;
}>();
</script>

<template>
  <div class="card w-full max-w-md p-4 md:p-8 flex flex-col gap-6 animate-fade-in overflow-y-auto max-h-[90dvh]">
    <div class="flex items-center gap-4">
      <button @click="emit('home')" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
        <ArrowLeft class="w-6 h-6 text-slate-600" />
      </button>
      <h2 class="text-2xl md:text-3xl font-bold text-slate-800">Så här spelar du</h2>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Ranked Mode -->
      <div class="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-purple-100 rounded-xl text-purple-600">
            <Swords class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-purple-900">Tävling</h3>
        </div>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Utmana dig själv! Du har 60 sekunder på dig att svara på så många frågor som möjligt.
        </p>
        <ul class="space-y-2">
          <li class="flex items-center gap-2 text-sm text-slate-700">
            <Clock class="w-4 h-4 text-purple-500" />
            <span>Tiden tickar ner från 60 sekunder</span>
          </li>
          <li class="flex items-center gap-2 text-sm text-slate-700">
            <Trophy class="w-4 h-4 text-purple-500" />
            <span>Få poäng för rätt svar. Svara rätt flera gånger i rad för bonus!</span>
          </li>
          <li class="flex items-center gap-2 text-sm text-slate-700">
            <SkipForward class="w-4 h-4 text-purple-500" />
            <span>Du kan hoppa över 2 svåra frågor</span>
          </li>
        </ul>
      </div>

      <!-- Practice Mode -->
      <div class="bg-sky-50 p-4 rounded-2xl border-2 border-sky-100">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-sky-100 rounded-xl text-sky-600">
            <GraduationCap class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-sky-900">Öva</h3>
        </div>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Ingen stress! Ta god tid på dig att lösa uppgifterna i din egen takt.
        </p>
        <ul class="space-y-2">
          <li class="flex items-center gap-2 text-sm text-slate-700">
            <Lightbulb class="w-4 h-4 text-sky-500" />
            <span>Få ledtrådar om du kör fast</span>
          </li>
          <li class="flex items-center gap-2 text-sm text-slate-700">
            <Eye class="w-4 h-4 text-sky-500" />
            <span>Se svaret om du vill lära dig</span>
          </li>
        </ul>
      </div>
    </div>

    <button 
      @click="emit('home')"
      class="btn-primary w-full flex items-center justify-center gap-2 text-lg py-3 mt-2"
    >
      <ArrowLeft class="w-5 h-5" />
      Tillbaka
    </button>
  </div>
</template>
