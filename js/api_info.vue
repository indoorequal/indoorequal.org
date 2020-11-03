<template>
  <div>
    <h2 class="title flex align-center">
      <v-btn
        icon
        @click="$emit('close')"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t('sidebar.api.title') }}
    </h2>
    <p class="my-2">{{ $t('sidebar.api.subtitle') }}</p>
    <i18n path="sidebar.api.content" tag="p" class="text-pre">
      <a href="https://github.com/indoorequal/mapbox-gl-indoorequal" target="_blank">{{ $t('sidebar.api.plugin') }}</a>
      <a href="https://indoorequal.com/" target="_blank">{{ $t('sidebar.api.indoorequalcom') }}</a>
    </i18n>
  </div>
</template>

<style scoped>
.text-pre {
  white-space: pre-line;
}
</style>
