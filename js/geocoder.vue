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

<script>
import { mdiMagnify } from '@mdi/js';
import { fetchGeocoding } from './maptiler';

export default {
  data() {
    return {
      error: null,
      isLoading: false,
      items: [],
      mdiMagnify,
      search: '',
      selected: null
    };
  },
  watch: {
    async search(val) {
      if (!val) return;
      this.error = null;
      this.isLoading = true;

      try {
        const geocodingResponse = await fetchGeocoding(val);
        this.items = geocodingResponse.features.map((feature) => {
          return {
            title: feature.place_name,
            value: feature.bbox
          };
        });
      } catch(err) {
        this.error = err;
      } finally {
        this.isLoading = false;
      }
    },
    selected(val) {
      if (val) {
        this.$emit('updateBounds', val.value);
      }
    }
  }
}
</script>
