<template>
  <v-card class="pa-2">
    <div class="d-flex align-center">
      <span class="text-h6 flex-grow-1">{{ $t('preview.title') }}</span>
      <v-tooltip bottom>
        <template v-slot:activator="{ props }">
          <v-btn
            :href="fileUrl"
            :download="filePreview.name"
            icon
            flat
            v-bind="props"
          >
            <v-icon>{{ mdiDownload }}</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('preview.download') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            flat
            @click="$emit('closePreview')"
            v-bind="props"
          >
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('preview.close') }}</span>
      </v-tooltip>
    </div>
    <v-file-input
      :label="$t('preview.file')"
      :clearable="false"
      :accept="fileFormats"
      :prepend-icon="mdiPuzzleCheck"
      dense
      full-width
      hide-details
      variant="underlined"
      @update:modelValue="openPreview"
    ></v-file-input>
  </v-card>
</template>

<script>
import { mdiDownload, mdiClose, mdiPuzzleCheck } from '@mdi/js';
import { fileFormats } from './preview';

export default {
  props: {
    filePreview: {
      type: File,
      required: true,
    }
  },

  data() {
    return {
      fileFormats: fileFormats.join(','),
      mdiClose,
      mdiDownload,
      mdiPuzzleCheck
    };
  },

  computed: {
    fileUrl() {
       return URL.createObjectURL(this.filePreview);
    }
  },

  methods: {
    openPreview(file) {
      if (!file) return;
      this.$emit('openPreview', file);
    }
  }
}
</script>
