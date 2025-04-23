<script setup>
defineProps({
  talk: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="hover-lift bg-gray-100 p-6 rounded-lg shadow-sm">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-sm text-gray-800">
        <p>{{ new Date(talk.createdAt).toLocaleDateString() }}</p>
        <p>{{ `${talk.talkLength} mins` }}</p>
      </div>
      <p class="text-gray-800">{{ talk.name }}</p>
      <h3 class="text-xl font-semibold text-gray-800">{{ talk.title }}</h3>
      <p class="text-gray-800">{{ talk.description }}</p>
      <div v-if="talk.tags" class="flex flex-wrap gap-2 mt-2">
        <div
          v-for="tag in talk.tags"
          :key="tag"
          class="px-3 py-1 bg-primaryOrange bg-opacity-60 text-white text-sm rounded-full hover:bg-primaryOrange transition"
        >
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>