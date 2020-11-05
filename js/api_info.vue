<template>
  <sub-sidebar
    :title="$t('sidebar.api.title')"
    @close="$emit('close')"
  >
    <p class="px-4 pt-3">{{ $t('sidebar.api.subtitle') }}</p>
    <i18n path="sidebar.api.content" tag="p" class="text-pre px-4">
      <a href="https://github.com/indoorequal/mapbox-gl-indoorequal" target="_blank">{{ $t('sidebar.api.plugin') }}</a>
      <a href="https://indoorequal.com/" target="_blank">{{ $t('sidebar.api.indoorequalcom') }}</a>
    </i18n>
  </sub-sidebar>
</template>

<script>
import SubSidebar from './sub_sidebar';

export default {
  components: { SubSidebar },
};
</script>

<style scoped>
.text-pre {
  white-space: pre-line;
}
</style>
