<template>
  <v-autocomplete
    v-model="selected"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    :error="!!error"
    :placeholder="$t('search')"
    :prepend-inner-icon="mdiMagnify"
    hide-no-data
    hide-details
    no-filter
    dense
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
            text: feature.place_name,
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
      this.$emit('select', val);
    }
  }
}
</script>
