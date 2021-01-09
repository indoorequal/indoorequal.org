<template>
  <div class="mapboxgl-ctrl mapboxgl-ctrl-group">
    <button
      :title="title"
      class="mapboxgl-ctrl-3d mapboxgl-ctrl-group"
      type="button"
      @click="toggle3d"
    >
      <span class="mapbox-ctrl-icon">
        <v-icon :color="iconColor">mdi-video-3d</v-icon>
      </span>
    </button>
  </div>
</template>

<script>
import { $helpers } from 'vue-mapbox/dist/vue-mapbox.umd.js';

export default {
  mixins: [$helpers.asControl],

  inject: ['indoorequal'],

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  mounted() {
    this.control = this;
    this.$_addControl();
  },

  computed: {
    iconColor() {
      return this.value ? 'primary' : '';
    },

    title() {
      return this.value ? this.$t('3d.hide') : this.$t('3d.show');
    }
  },

  methods: {
    onAdd() {
      return this.$el;
    },

    onRemove() {
      this.$el.remove();
    },

    toggle3d() {
      this.$emit('input', !this.value);
    }
  },
};
</script>
