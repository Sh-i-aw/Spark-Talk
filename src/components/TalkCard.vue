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
        <p class="text-gray-800">{{ talk.name }}</p>
        <p>{{ `${talk.talkLength} mins` }}</p>
      </div>
      <h3 class="text-xl font-semibold text-gray-800">{{ talk.title }}</h3>
      <p class="text-gray-800">{{ talk.description }}</p>
      <div class="flex justify-between">
        <div v-if="talk.tags" class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="tag in talk.tags"
            :key="tag"
            class="px-3 py-1 bg-primaryOrange bg-opacity-60 text-white text-sm rounded-full hover:bg-primaryOrange transition"
          >
            {{ tag }}
          </div>
        </div>
        <div v-if="talk.repoLink" class="mt-2">
          <a
            :href="talk.repoLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              class="w-5 h-5"
            >
              <path
                d="M12 0C5.37 0 0 5.373 0 12c0 5.304 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.614-4.042-1.614-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.729.083-.729 1.204.086 1.837 1.237 1.837 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.304.762-1.604-2.665-.3-5.467-1.335-5.467-5.933 0-1.31.468-2.382 1.235-3.222-.124-.303-.535-1.522.117-3.176 0 0 1.008-.322 3.3 1.23a11.53 11.53 0 0 1 3.003-.404c1.02.005 2.048.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.654 1.654.243 2.873.12 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.807 5.63-5.48 5.922.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.192.694.8.576C20.565 21.796 24 17.303 24 12c0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
