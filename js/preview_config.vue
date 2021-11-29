<template>
  <sub-sidebar
    :title="$t('preview.title')"
    @close="$emit('close')"
  >
    <div class="mx-4">
      <p class="pt-4">{{ $t('preview.description') }}</p>
      <v-file-input
        :label="$t('preview.file')"
        accept=".geojson"
        @change="openPreview"
      ></v-file-input>
    </div>
  </sub-sidebar>
</template>

<script>
import SubSidebar from './sub_sidebar';

export default {
  components: { SubSidebar },

  methods: {
    openPreview(file) {
      if (!file) return;
      this.$emit('openPreview', file);
    }
  }
};
</script>
