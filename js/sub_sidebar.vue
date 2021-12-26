<template>
  <div>
    <v-toolbar>
      <v-btn
        icon
        @click="$emit('close')"
      >
        <v-icon>{{ mdiArrowLeft }}</v-icon>
      </v-btn>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <slot />
  </div>
</template>

<script>
import { mdiArrowLeft } from '@mdi/js';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return { mdiArrowLeft };
  }
};
</script>
