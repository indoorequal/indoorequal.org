<template>
  <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
    <button
      v-if="levels.length > 1"
      v-for="level in levels"
      :class="{ 'mapboxgl-ctrl-active': value === level }"
      @click="onClick(level)"
    >
      <strong>{{ level }}</strong>
    </button>
  </div>
</template>

<script>
import { $helpers } from 'vue-mapbox/dist/vue-mapbox.umd.js';
import { debounce } from 'debounce';
import { findAllLevels } from './levels';

export default {
  mixins: [$helpers.asControl],

  props: {
    source: {
      type: String,
      required: true
    },
    layer: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
  },

  data() {
    return {
      levels: []
    };
  },

  mounted() {
    this.control = this;
    this.$_addControl();

    const updateLevels = debounce(this.updateLevels, 1000);

    this.map.on('load', updateLevels);
    this.map.on('data', updateLevels);
    this.map.on('move', updateLevels);
  },

  methods: {
    onAdd() {
      return this.$el;
    },

    onRemove() {
    },

    onClick(level) {
      this.$emit('input', level);
    },

    findAllLevels,

    updateLevels(e) {
      if (this.map.isSourceLoaded(this.source)) {
        const features = this.map.querySourceFeatures(this.source,
                                                      {
                                                        sourceLayer: this.layer,
                                                        filter: ['has', 'level']
                                                      });
        this.levels = this.findAllLevels(features);
      }
    }
  },

  watch: {
    levels(levels) {
      if (!levels.includes(this.value)) {
        this.onClick(0);
      }
    }
  }
};
</script>

<style scoped>
  button {
    width: 100%;
  }
  button.mapboxgl-ctrl-active {
    background-color: #b7b7b7;
  }
</style>
