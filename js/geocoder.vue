<template>
  <v-autocomplete
    v-model="selected"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    :error="!!error"
    hide-no-data
    hide-details
    dense
    placeholder="Search"
    background-color="white"
    prepend-inner-icon="mdi-magnify"
    class="geocoder"
  />
</template>

<script>
import { apiKey } from '../config.json';

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
    search(val) {
      if (!val) return;
      this.error = null;
      this.isLoading = true;

      fetch(`https://api.maptiler.com/geocoding/${this.search}.json?key=${apiKey}`)
        .then(res => res.json())
        .then(body => {
          this.items = body.features.map((feature) => {
            return {
              text: feature.place_name,
              value: feature.bbox
            };
          });
        })
        .catch(err => {
          this.error = err;
        })
        .finally(() => (this.isLoading = false))
    },
    selected(val) {
      this.$emit('select', val);
    }
  }
}
</script>
