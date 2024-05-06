<template>
  <mgl-custom-control position="top-right">
    <button
      :title="title"
      class="maplibregl-ctrl-heatmap"
      type="button"
      @click="toggleHeatmap"
    >
      <span class="maplibregl-ctrl-icon">
        <v-icon :color="iconColor" size="24px">{{ mdiBlur }}</v-icon>
      </span>
    </button>
  </mgl-custom-control>
</template>

<script>
import { MglCustomControl } from '@indoorequal/vue-maplibre-gl';
import { mdiBlur } from '@mdi/js';

export default {
  components: { MglCustomControl },
  
  inject: ['indoorequal'],

  data() {
    return {
      mdiBlur,
      heatmap: true
    };
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
