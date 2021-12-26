<template>
  <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
    <button
      :title="title"
      class="mapboxgl-ctrl-heatmap mapboxgl-ctrl-group"
      type="button"
      @click="toggleHeatmap"
    >
      <span class="mapbox-ctrl-icon">
        <v-icon :color="iconColor">{{ mdiBlur }}</v-icon>
      </span>
    </button>
  </div>
</template>

<script>
import { $helpers } from 'vue-mapbox/dist/vue-mapbox.umd.js';
import { mdiBlur } from '@mdi/js';

export default {
  mixins: [$helpers.asControl],

  inject: ['indoorequal'],

  data() {
    return {
      mdiBlur,
      heatmap: true
    };
  },

  mounted() {
    this.control = this;
    this.$_addControl();
  },

  computed: {
    iconColor() {
      return this.heatmap ? 'primary' : '';
    },

    title() {
      return this.heatmap ? this.$t('heatmap.hide') : this.$t('heatmap.show');
    }
  },

  methods: {
    onAdd() {
      return this.$el;
    },

    onRemove() {
      this.$el.remove();
    },

    toggleHeatmap() {
      this.heatmap = !this.heatmap;
    }
  },

  watch: {
    heatmap(visible) {
      this.indoorequal.setHeatmapVisible(this.heatmap);
    }
  },
};
</script>
