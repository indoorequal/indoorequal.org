<template>
  <mgl-custom-control
    class="maplibregl-ctrl level-ctrl"
    position="bottom-right"
  >
    <v-btn
      v-for="level in levels"
      :color="level == value ? 'primary' : 'white'"
      class="button d-block mb-2"
      @click="setLevel(level)"
    >
      {{ level }}
    </v-btn>
  </mgl-custom-control>
</template>

<script>
import { MglCustomControl } from '@indoorequal/vue-maplibre-gl';

export default {
  components: { MglCustomControl },

  inject: ['indoorequal'],

  emits: ['input', 'levels'],

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
      if (isNaN(parseInt(a, 10))) {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }
        return 0;
      } else {
        return a - b;
      }
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
      this.$emit('levels', levels);
    }
    updateLevels(this.indoorequal.levels);
    this.indoorequal.setLevel(this.value);
    this.indoorequal.on('levelchange', (level) => this.$emit('input', level));
    this.indoorequal.on('levelschange', (levels) => updateLevels(levels));
  },

  methods: {
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


<style>
.level-ctrl {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
<style scoped>
.button {
  margin: 0 auto;
}
</style>
