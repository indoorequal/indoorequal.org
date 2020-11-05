<template>
  <div>
    <h2 class="title flex align-center pa-3 pb-0">
      <v-btn
        icon
        @click="$emit('close')"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ title }}
    </h2>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
