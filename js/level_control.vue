<template>
  <div class="mapboxgl-ctrl pt-2">
    <v-btn
      v-for="level in levels"
      :class="{ 'black--text': level !== value }"
      :color="level == value ? 'primary' : 'white'"
      fab
      dark
      class="button d-block mb-2"
      @click="setLevel(level)"
    >
      {{ level }}
    </v-btn>
  </div>
</template>

<script>
import { $helpers } from 'vue-mapbox/dist/vue-mapbox.umd.js';
import IndoorEqual from 'mapbox-gl-indoorequal';
import { indoorEqualApiKey, tilesUrl } from '../config.json';

export default {
  mixins: [$helpers.asControl],

  props: {
    value: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      levels: []
    };
  },

  mounted() {
    this.indoorequal = new IndoorEqual(this.map, { apiKey: indoorEqualApiKey, url: tilesUrl });
    this.indoorequal.loadSprite('/indoorequal', { update: true });
    this.control = this;
    this.$_addControl();
    this.levels = this.indoorequal.levels;
    this.indoorequal.setLevel(this.value);
    this.indoorequal.on('levelchange', (level) => this.$emit('input', level));
    this.indoorequal.on('levelschange', (levels) => this.levels = levels);
  },

  methods: {
    onAdd() {
      return this.$el;
    },

    onRemove() {
      this.$el.remove();
    },

    setLevel(level) {
      this.indoorequal.setLevel(level);
    }
  }
};
</script>

<style scoped>
.mapboxgl-ctrl {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  width: 90px;
}
.button {
  margin: 0 auto;
}
</style>
