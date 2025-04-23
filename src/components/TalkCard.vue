<script setup>
defineProps({
  talk: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="hover-lift bg-gray-700 p-6 rounded-lg shadow-lg">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-sm text-gray-300">
        <p>{{ new Date(talk.createdAt).toLocaleDateString() }}</p>
        <p>{{ `${talk.talkLength} mins` }}</p>
      </div>
      <h3 class="text-xl font-semibold text-white">{{ talk.title }}</h3>
      <p class="text-gray-300">{{ talk.name }}</p>
      <div v-if="talk.tags" class="flex flex-wrap gap-2 mt-2">
        <div
          v-for="tag in talk.tags"
          :key="tag"
          class="px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition"
        >
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>