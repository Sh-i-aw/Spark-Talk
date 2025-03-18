<script setup>
  import {ref, onMounted} from 'vue'
  import {generateTagsWithOllama} from "@/helpers/OllamaHelper.js";
  import {getTalks, getTags, insertTagsForPastTalk, insertNewTagIfNeeded} from "@/helpers/firestoreHelper.js";

  const talks = ref(null);
  const tags = ref([]);

  onMounted( async() => {
    talks.value = await getTalks();
    tags.value = await getTags();
  })

  async function testTagGeneration() {
    await Promise.all(
      talks.value.map(async (talk) => {
        try {
          let resultTags = await generateTagsWithOllama(tags.value, talk.title, talk.description)

          if (typeof resultTags === "string") {
            resultTags = JSON.parse(resultTags);
          }

          await insertTagsForPastTalk(talk, resultTags);
          console.log(`Inserted tags ${resultTags} into ${talk.title} by ${talk.name}`);

          await Promise.all (
              resultTags.map(async (tag) => {
                try {
                  insertNewTagIfNeeded(tag);
                } catch (e) {
                  console.error(`Error while inserting new tag ${tag}`)
                }
              })
          )
        } catch (e) {
          console.log(`Error inserting tags for talk ${talk.title} by ${talk.name}`)
        }
      })
    )
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
  <header>
    <h1 style="position: fixed">Spark Talk</h1>
      <div style="position: fixed; top: 50px">
        <button>Scroll Top</button>
        <button>Scroll Middle</button>
        <button>Move Bottom</button>
        <br/>
        <button @click="testTagGeneration">Test tagging with Llama</button>
      </div>
  </header>

  <main>
      <div style="padding: 100px;">
        <div v-for="talk in talks" :key="talk.id" class="talkCard">
          <p>{{talk.createdAt.toString()}}</p>
          <p>{{`${talk.talkLength} mins`}}</p>
          <h3>{{talk.title}}</h3>
          <p>{{talk.name}}</p>
        </div>
      </div>
  </main>

</template>

<style scoped>

  .talkCard
  {
    display:flex;
    flex-direction: column;
    background-color: darkgray;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem;
  }
</style>