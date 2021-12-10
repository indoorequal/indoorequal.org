<template>
  <sub-sidebar
    :title="$t('preview.title')"
    @close="$emit('close')"
  >
    <div class="mx-4">
      <p class="pt-4">{{ $t('preview.description') }}</p>
      <h3>{{ $t('preview.how.title') }}</h3>
      <ol class="py-3">
        <li>{{ $t('preview.how.content1') }}</li>
        <li>{{ $t('preview.how.content2') }}</li>
        <li>{{ $t('preview.how.content3') }}</li>
      </ol>
      <p><strong>{{ $t('preview.no_data_uploaded') }}</strong></p>
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
