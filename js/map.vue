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
import LevelControl from './level_control';
import HeatmapControl from './heatmap_control';
import baseMapMixin from './base_map';

export default {
  mixins: [baseMapMixin],

  components: {
    HeatmapControl,
    LevelControl,
    MglGeolocateControl,
    MglMap,
    MglNavigationControl
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
