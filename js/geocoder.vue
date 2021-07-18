<template>
  <v-autocomplete
    v-model="selected"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    :error="!!error"
    :placeholder="$t('search')"
    hide-no-data
    hide-details
    no-filter
    dense
    background-color="white"
    prepend-inner-icon="mdi-magnify"
    class="geocoder"
  />
</template>

<script>
import { fetchGeocoding } from './maptiler';

export default {
  data() {
    return {
      isLoading: false,
      items: [],
      search: '',
      selected: null,
      error: null
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
