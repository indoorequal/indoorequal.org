<template>
  <v-card class="pa-2">
    <div class="d-flex align-center">
      <span class="text-h6 flex-grow-1">{{ $t('preview.title') }}</span>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            @click="$emit('closePreview')"
            v-on="on"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('preview.close') }}</span>
      </v-tooltip>
    </div>
    <v-file-input
      :label="$t('preview.file')"
      :clearable="false"
      prepend-icon="mdi-puzzle-check"
      dense
      full-width
      hide-details
      accept=".geojson,.zip"
      @change="openPreview"
    ></v-file-input>
  </v-card>
</template>

<script>
export default {
  methods: {
    openPreview(file) {
      if (!file) return;
      this.$emit('openPreview', file);
    }
  }
}
</script>
