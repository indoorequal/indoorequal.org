<template>
  <v-card class="pa-2">
    <div class="d-flex align-center">
      <span class="text-h6 flex-grow-1">{{ t('preview.title') }}</span>
      <v-tooltip location="bottom">
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
        <span>{{ t('preview.download') }}</span>
      </v-tooltip>
      <v-tooltip location="bottom">
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
        <span>{{ t('preview.close') }}</span>
      </v-tooltip>
    </div>
    <v-file-input
      :label="t('preview.file')"
      :clearable="false"
      :accept="acceptedFileFormats"
      :prepend-icon="mdiPuzzleCheck"
      dense
      full-width
      hide-details
      variant="underlined"
      @update:modelValue="openPreview"
    ></v-file-input>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { mdiDownload, mdiClose, mdiPuzzleCheck } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { fileFormats } from './preview';

const { t } = useI18n();

const props = defineProps({
  filePreview: {
    type: File,
    required: true,
  }
});

const acceptedFileFormats = fileFormats.join(',');

const fileUrl = computed(() => {
  return URL.createObjectURL(props.filePreview);
});

const emit = defineEmits(['openPreview']);
function openPreview(file) {
  if (!file) return;
  emit('openPreview', file);
}
</script>
