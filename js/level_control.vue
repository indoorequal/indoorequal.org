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

export default {
  mixins: [$helpers.asControl],

  inject: ['indoorequal'],

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
    function sortLevels(a, b) {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      }
      return 0;
    }
    const updateLevels = (levels) => {
      this.levels = levels.sort(sortLevels).reverse();
      if (this.levels.length > 0 && !this.levels.includes(this.indoorequal.level)) {
        if (this.levels.includes('0')) {
          this.setLevel('0');
        } else {
          this.setLevel(this.levels[this.levels.length - 1]);
        }
      }
    }
    this.control = this;
    this.$_addControl();
    updateLevels(this.indoorequal.levels);
    this.indoorequal.setLevel(this.value);
    this.indoorequal.on('levelchange', (level) => this.$emit('input', level));
    this.indoorequal.on('levelschange', (levels) => updateLevels(levels));
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
  },

  watch: {
    value(newLevel) {
      if (newLevel !== this.indoorequal.level) {
        this.setLevel(newLevel);
      }
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
