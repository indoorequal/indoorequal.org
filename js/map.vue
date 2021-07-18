<template>
  <MglMap
    :center="mapCenter"
    :zoom="mapZoom"
    :map-style="mapStyle"
    hash="map"
    @load="load"
    @update:center="updateMapCenter"
    @update:zoom="updateMapZoom"
    @mouseenter-indoor-poi-rank1="mouseenterLayer"
    @click-indoor-poi-rank1="clickLayer"
    @mouseleave-indoor-poi-rank1="mouseleaveLayer"
    @mouseenter-indoor-poi-rank2="mouseenterLayer"
    @click-indoor-poi-rank2="clickLayer"
    @mouseleave-indoor-poi-rank2="mouseleaveLayer"
  >
    <MglNavigationControl show-compass />
    <MglGeolocateControl />
    <heatmap-control />
    <level-control
      :value="mapLevel"
      position="bottom-right"
      @input="updateMapLevel"
    />
    <slot />
  </MglMap>
</template>

<script>
import { MglMap, MglNavigationControl, MglGeolocateControl } from 'vue-mapbox/dist/vue-mapbox.umd';
import IndoorEqual from 'mapbox-gl-indoorequal';
import { indoorEqualApiKey, tilesUrl } from '../config.json';
import { mapStyle } from './maptiler';
import LevelControl from './level_control';
import HeatmapControl from './heatmap_control';

export default {
  components: {
    HeatmapControl,
    LevelControl,
    MglGeolocateControl,
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

  provide() {
    const self = this;
    return {
      get indoorequal() {
        return self.indoorEqualInstance;
      }
    };
  },

  data() {
    return {
      mapStyle: mapStyle()
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
      this.indoorEqualInstance = new IndoorEqual(this.map, { apiKey: indoorEqualApiKey, url: tilesUrl });
      this.indoorEqualInstance.loadSprite('/indoorequal')
        .then((sprite) => {
          this.$emit('sprite', sprite);
        });
      setTimeout(() => {
        this.updateMapZoom(map.getZoom());
      }, 100);
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
    },

    mouseenterLayer(e) {
      e.map.getCanvas().style.cursor = 'pointer';
    },

    clickLayer(e) {
      const id = e.mapboxEvent.features[0].properties.id;
      this.$emit('clickPoi', id);
    },

    mouseleaveLayer(e) {
      e.map.getCanvas().style.cursor = '';
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
