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
        sections: sections.sort((a, b) => b.monthIndex - a.monthIndex), // optional
      }))
      .sort((a, b) => b.year - a.year);
});

// Get the latest month for a year
function getLatestMonth(year) {
  const yearSections = sectionsByYear.value[year];
  if (!yearSections || yearSections.length === 0) return null;
  return yearSections[0]; // Since sections are already sorted by date
}
</script>

<template>
  <div
    class="fixed right-8 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"
  >
    <div
        v-for="entry in sectionsByYear"
        :key="entry.year"
        class="space-y-2"
    >
      <button
          @click="scrollToSection(entry.year, getLatestMonth(entry.year)?.monthName)"
          class="text-lg font-semibold mt-2 hover:text-primaryOrange transition-colors"
      >
        {{ entry.year }}
      </button>
      <div class="pl-4 space-y-1">
        <button
            v-for="section in entry.sections"
            :key="`${section.year}-${section.monthIndex}`"
            @click="scrollToSection(section.year, section.monthName)"
            class="text-sm hover:text-primaryOrange transition-colors block"
        >
          {{ section.monthName }}
        </button>
      </div>
    </div>
  </div>
</template>
