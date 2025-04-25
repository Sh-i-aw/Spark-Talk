<script setup>
defineEmits(['click'])
</script>

<template>
  <button
      @click="$emit('click')"
      class="px-4 py-2 bg-primaryOrange text-white rounded-xl hover:brightness-90 transition"
  >
    <slot />
  </button>
</template>

