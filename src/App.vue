<script setup>
import { ref, computed, onMounted } from "vue";
import { generateTagsWithOllama } from "@/helpers/OllamaHelper.js";
import {
  getTalks,
  getTags,
  insertTagsForPastTalk,
  insertNewTagIfNeeded,
} from "@/helpers/firestoreHelper.js";

const talks = ref(null);
const tags = ref([]);
const filter = ref ([]);

onMounted(async () => {
  talks.value = await getTalks();
  tags.value = await getTags();
});

function clearFilter () {
  filter.value = [];
}

function insertFilter (tag) {
  filter.value.push(tag)
}

const filteredTalks = computed(() => {
  if (filter.value.length === 0) {
    return talks.value;
  }

  return (talks.value || []).filter((talk) => {
    if (!talk.tags) return false;
    return filter.value.some((tag) => talk.tags.includes(tag))
  })
})

async function testTagGeneration() {
  await Promise.all(
    talks.value.map(async (talk) => {
      try {
        let resultTags = await generateTagsWithOllama(
          tags.value,
          talk.title,
          talk.description
        );

        if (typeof resultTags === "string") {
          resultTags = JSON.parse(resultTags);
        }

        await insertTagsForPastTalk(talk, resultTags);
        console.log(
          `Inserted tags ${resultTags} into ${talk.title} by ${talk.name}`
        );

        await Promise.all(
          resultTags.map(async (tag) => {
            try {
              insertNewTagIfNeeded(tag);
            } catch (e) {
              console.error(`Error while inserting new tag ${tag}`);
            }
          })
        );
      } catch (e) {
        console.log(
          `Error inserting tags for talk ${talk.title} by ${talk.name}`
        );
      }
    })
  );
  // const samples = talks.value.slice(0, 5);
  // const promises = samples.map(talk => generateTagsWithOllama(tags.value, talk.title, talk.description));
  // const results = await Promise.all(promises);
  //
  // results.forEach((tags, i) => {
  //   const talk = samples[i];
  //   console.log(`${talk.title} by ${talk.name}: ${talk.description}`);
  //   console.log("Tags →", tags);
  // });

  // const sample = talks.value[0]

  //
  // console.log(`inserted tags ${resultTags} into ${sample.title} by ${sample.name}`);
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Left Sidebar -->
    <div
      class="w-1/4 bg-gray-500 p-6 fixed left-0 top-0 h-full flex flex-col gap-6"
    >
      <h1 class="text-2xl font-bold text-white">Spark Talk</h1>

      <div class="flex flex-col gap-2">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Scroll Top
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Scroll Middle
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Move Bottom
        </button>
        <button
          @click="testTagGeneration"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Test tagging with Llama
        </button>
        <button
            @click="clearFilter"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Clear Filter
        </button>
      </div>

      <!-- Tags Section -->
      <div class="mt-6">
        <h2 class="text-xl font-semibold text-white mb-4">Tags</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in tags"
            :key="tag"
            @click="insertFilter(tag)"
            class="px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Right Content Area -->
    <div class="w-3/4 ml-[25%] p-6 overflow-y-auto">
      <div class="max-w-4xl mx-auto">
        <div class="grid gap-4">
          <div
            v-for="talk in filteredTalks"
            :key="talk.id"
            class="talkCard bg-gray-700 p-6 rounded-lg shadow-lg"
          >
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.talkCard {
  transition: transform 0.2s ease-in-out;
}

.talkCard:hover {
  transform: translateY(-2px);
}
</style>
