<template>
  <v-autocomplete
    v-model="selected"
    v-model:search="search"
    :items="items"
    :loading="isLoading"
    :error="!!error"
    :placeholder="$t('search')"
    :prepend-inner-icon="mdiMagnify"
    :return-object="true"
    hide-no-data
    hide-details
    no-filter
    density="compact"
    variant="underlined"
    background-color="white"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { mdiMagnify } from '@mdi/js';
import { fetchGeocoding } from './maptiler';

const error = ref(null);
const isLoading = ref(false);
const items = ref([]);
const search = ref('');
const selected = ref(null);

watch(
  () => search.value,
  async (val) => {
    if (!val) return;
    error.value = null;
    isLoading.value = true;

    try {
      const geocodingResponse = await fetchGeocoding(val);
      items.value = geocodingResponse.features.map((feature) => {
        return {
          title: feature.place_name,
          value: feature.bbox
        };
      });
    } catch(err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  },
);

const emit = defineEmits(['updateBounds']);
watch(
  () => selected.value,
  (val) => {
    if (val) {
      emit('updateBounds', val.value);
    }
  }
);
</script>
