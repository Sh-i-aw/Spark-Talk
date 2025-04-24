<script setup>
import { computed } from "vue";

const props = defineProps({
  sections: {
    type: Array,
    required: true,
  },
});

function scrollToSection(year, monthName) {
  const element = document.getElementById(`anchor-${year}-${monthName}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Group sections by year
const sectionsByYear = computed(() => {
  const grouped = {};
  props.sections.forEach((section) => {
    if (!grouped[section.year]) {
      grouped[section.year] = [];
    }
    grouped[section.year].push(section);
  });

  return Object.entries(grouped)
    .map(([year, sections]) => ({
      year,
      sections: sections.sort((a, b) => b.monthIndex - a.monthIndex),
    }))
    .sort((a, b) => b.year - a.year);
});

// Get the latest month for a year
function getLatestMonth(year) {
  const yearSections = sectionsByYear.value[year];
  if (!yearSections || yearSections.length === 0) return null;
  return yearSections[0];
}

</script>

<template>
  <div
    class="fixed right-8 top-1/4 transform -translate-y-1/2 transition-all duration-300 group"
  >
    <!-- Grey floating TOC -->
    <div
      class="space-y-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
    >
      <div v-for="entry in sectionsByYear" :key="entry.year" class="space-y-2">
        <div class="h-1 bg-gray-300 rounded w-6 m-1"></div>
        <div class="w-4 space-y-2 m-1">
          <div
            v-for="section in entry.sections"
            :key="`${section.year}-${section.monthIndex}`"
            class="h-0.5 bg-gray-300 w-4 flex flex-col items-end "
          ></div>
        </div>
      </div>
    </div>

    <!-- Full View (On Hover) -->
    <div
      class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-95 p-6 rounded-lg shadow-lg"
    >
      <div
        v-for="entry in sectionsByYear"
        :key="entry.year"
        class="space-y-2"
      >
        <button
          @click="
            scrollToSection(entry.year, getLatestMonth(entry.year)?.monthName)
          "
          class="text-lg font-semibold mt-2 hover:text-primaryOrange transition-colors flex items-center gap-2"
        >
          {{ entry.year }}
        </button>
        <div class="pl-4 space-y-1">
          <button
            v-for="section in entry.sections"
            :key="`${section.year}-${section.monthIndex}`"
            @click="scrollToSection(section.year, section.monthName)"
            class="text-sm hover:text-primaryOrange transition-colors block flex items-center gap-2"
          >
            {{ section.monthName }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
