<template>
  <div>
    <MglMap
      :center="mapCenter"
      :zoom="mapZoom"
      :map-style="mapStyle"
      hash="map"
      @load="load"
      @update:center="updateMapCenter"
      @update:zoom="updateMapZoom"
    >
      <MglNavigationControl show-compass />
      <level-control
        :value="mapLevel"
        @input="updateMapLevel"
      />
    </MglMap>
    <img
      v-for="(icon, key) in icons"
      v-show="false"
      :ref="key"
      :src="icon"
   />
  </div>
</template>

<script>
import { MglMap, MglNavigationControl } from 'vue-mapbox/dist/vue-mapbox.umd';
import { apiKey } from '../config.json';
import icons from '../mapicons/*.svg';
import LevelControl from './level_control';

export default {
  components: {
    LevelControl,
    MglMap,
    MglNavigationControl
  },

  props: {
    mapBounds: {
      type: Array,
      required: false,
      default() { return []; }
    },

    mapCenter: {
      type: Object,
      required: true
    },

    mapLevel: {
      type: String,
      required: true
    },

    mapZoom: {
      type: Number,
      required: true
    },

    newMapBounds: {
      type: Array,
      required: false,
      default() { return []; }
    },
  },

  data() {
    return {
      icons,
      mapStyle: `https://api.maptiler.com/maps/bright/style.json?key=${apiKey}`
    };
  },

  watch: {
    newMapBounds(bbox) {
      this.map.fitBounds(bbox, { duration: 0 });
    }
  },

  methods: {
    load({ map }) {
      this.map = map;
      this.registerIcons();
      setTimeout(() => {
        this.updateMapZoom(map.getZoom());
      }, 100);
    },

    registerIcons() {
      for (let icon in this.icons) {
        if (this.map.hasImage(icon)) {
          this.map.updateImage(icon, this.$refs[icon][0]);
        } else {
          this.map.addImage(icon, this.$refs[icon][0]);
        }
      }
    },

    updateMapCenter(mapCenter) {
      this.$emit('update:mapCenter', mapCenter);
      this.updateMapBounds();
    },

    updateMapBounds() {
      const bounds = this.map.getBounds();
      this.$emit('update:mapBounds', [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
    },

    updateMapLevel(mapLevel) {
      this.$emit('update:mapLevel', mapLevel);
    },

    updateMapZoom(mapZoom) {
      this.$emit('update:mapZoom', mapZoom);
      this.updateMapBounds();
    }
  }
};
</script>

<style>
.mgl-map-wrapper {
  height: 100vh;
  position: relative;
  width: 100vw;
}

.mgl-map-wrapper .mapboxgl-map {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
