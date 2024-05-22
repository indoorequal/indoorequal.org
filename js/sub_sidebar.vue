<template>
  <div>
    <v-toolbar elevation="3" color="white">
      <v-btn
        icon
        @click="$emit('close')"
      >
        <v-icon>{{ mdiArrowLeft }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ props.title }}
      </v-toolbar-title>
    </v-toolbar>
    <slot />
  </div>
</template>

<script setup>
import { mdiArrowLeft } from '@mdi/js';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
