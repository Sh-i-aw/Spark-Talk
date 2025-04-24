<script setup>
import { ref, computed, onMounted } from "vue";
import { generateTagsWithOllama } from "@/helpers/OllamaHelper.js";
import {
  getTalks,
  getTags,
  getVideoLinks,
  insertTagsForPastTalk,
  insertNewTagIfNeeded,
} from "@/helpers/firestoreHelper.js";
import TalkCard from "@/components/TalkCard.vue";
import TableOfContents from "@/components/TableOfContents.vue";
import TalkAppHeader from "@/components/TalkAppHeader.vue";

const talks = ref(null);
const tags = ref([]);
const videoLinks = ref([]);
const filter = ref([]);

onMounted(async () => {
  talks.value = await getTalks();
  tags.value = await getTags();
  videoLinks.value = await getVideoLinks();
});

function clearFilter() {
  filter.value = [];
}

function insertFilter(tag) {
  filter.value.push(tag);
}

function getRecordingLink(year, month) {
  const recordingLink = videoLinks.value.find(
    (linkRecord) => linkRecord.id === `${month} ${year}`
  );
  if (!recordingLink) return "";
  return recordingLink.link;
}

const filteredTalks = computed(() => {
  if (filter.value.length === 0) {
    return talks.value;
  }

  return (talks.value || []).filter((talk) => {
    if (!talk.tags) return false;
    return filter.value.some((tag) => talk.tags.includes(tag));
  });
});

const groupedTalkSections = computed(() => {
  if (!talks.value) return [];

  const map = new Map();

  for (const talk of talks.value) {
    const date = new Date(talk.createdAt);
    const year = date.getFullYear();
    const monthIndex = date.getMonth(); // 0 = Jan
    const monthName = date.toLocaleString("default", { month: "short" });

    const key = `${year}-${monthIndex}`;
    if (!map.has(key)) {
      map.set(key, {
        year,
        monthIndex,
        monthName,
        talks: [],
      });
    }

    map.get(key).talks.push(talk);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.monthIndex - a.monthIndex;
  });
});

function scrollToCurrentMonth() {
  const now = new Date();
  console.log(`anchor-${now.getFullYear()}-${now.toLocaleString("default", { month: "short" })}`)
  const element = document.getElementById(`anchor-${now.getFullYear()}-${now.toLocaleString("default", { month: "short" })}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

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
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Left Sidebar -->
    <div class="w-1/4 p-8 fixed left-0 top-0 h-full flex flex-col gap-6">
      <TalkAppHeader />
      <div class="flex flex-col gap-2">
        <button
          @click="clearFilter"
          class="px-4 py-2 bg-primaryOrange text-white rounded-xl hover:brightness-90 transition"
        >
          Submit A Talk
        </button>
        <button
          @click="scrollToCurrentMonth"
          class="px-4 py-2 border border-primaryOrange text-primaryOrange rounded-xl hover:bg-secondaryOrange hover:bg-opacity-15 transition"
        >
          View Schedule
        </button>

        <!-- Selected Tags Display -->
        <div v-if="filter.length > 0" class="flex flex-col gap-2 mt-2">
          <button
              @click="clearFilter"
              class="px-4 py-2 bg-primaryOrange text-white rounded-xl hover:brightness-90 transition"
          >
            Clear It, Clear It Real Good!
          </button>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="selectedTag in filter"
              :key="selectedTag"
              class="px-3 py-1 bg-primaryOrange text-white font-bold text-sm rounded-full"
            >
              {{ selectedTag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tags Section -->
      <div class="mt-6">
        <h2 class="text-xl font-semibold text-white mb-4">Tags</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in tags.filter((t) => !filter.includes(t))"
            :key="tag"
            @click="insertFilter(tag)"
            class="px-3 py-1 bg-yellow-500 bg-opacity-60 text-white font-bold text-sm rounded-full hover:bg-primaryOrange"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- Talk Cards -->
    <div class="w-3/4 ml-[25%] p-2 overflow-y-auto">
      <div class="w-full px-12 pt-0 pr-24 mx-auto">
        <div v-if="filter.length > 0" class="grid gap-4">
          <TalkCard v-for="talk in filteredTalks" :key="talk.id" :talk="talk" />
        </div>
        <div v-else>
          <TableOfContents :sections="groupedTalkSections" />
          <div
            v-for="section in groupedTalkSections"
            :key="`${section.year}-${section.monthIndex}`"
          >
            <div
              :id="`anchor-${section.year}-${section.monthName}`"
              class="pt-10"
            >
              <div class="flex items-start mb-4">
                <h2 class="text-2xl font-bold mr-4">
                  {{ `${section.year} ${section.monthName}` }}
                </h2>
                <a
                  :href="getRecordingLink(section.year, section.monthName)"
                  target="_blank"
                  class="hover-lift w-8 h-8 rounded-xl bg-red-400 flex items-center justify-center hover:bg-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
              </div>
            </div>

            <div class="grid gap-4">
              <TalkCard
                v-for="talk in section.talks"
                :key="talk.id"
                :talk="talk"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
