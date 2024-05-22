<template>
  <sub-sidebar
    :title="$t('preview.title')"
    @close="$emit('close')"
  >
    <div class="mx-4">
      <p class="pt-4">{{ $t('preview.description') }}</p>
      <p>{{ $t('preview.imdf') }}</p>
      <h3 class="text-h5">{{ $t('preview.how.title') }}</h3>
      <ol class="py-3">
        <li>{{ $t('preview.how.content1') }}</li>
        <li>{{ $t('preview.how.content2') }}</li>
        <li>{{ $t('preview.how.content3') }}</li>
      </ol>
      <p><strong>{{ $t('preview.no_data_uploaded') }}</strong></p>
      <v-file-input
        :label="$t('preview.file')"
        :accept="acceptedFileFormats"
        variant="underlined"
        @update:modelValue="openPreview"
      ></v-file-input>
    </div>
  </sub-sidebar>
</template>

<script setup>
import SubSidebar from './sub_sidebar';
import { fileFormats } from '../preview/preview';

const emit = defineEmits(['openPreview']);

const acceptedFileFormats = fileFormats.join(',');

function openPreview(file) {
  if (!file) return;
  emit('openPreview', file);
}
</script>
