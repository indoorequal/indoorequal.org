<template>
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
    <MglGeolocateControl />
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
import bbox from '@turf/bbox';
import LevelControl from '../level_control';
import baseMapMixin from '../base_map';

export default {
  mixins: [baseMapMixin],

  components: {
    LevelControl,
    MglGeolocateControl,
    MglMap,
    MglNavigationControl
  },

  props: {
    geojson: {
      type: Object,
      required: true
    }
  },

  methods: {
    load({ map }) {
      this.map = map;
      this.indoorEqualInstance = new IndoorEqual(this.map, { geojson: this.geojson });
      this.indoorEqualInstance.loadSprite('/indoorequal')
        .then((sprite) => {
          this.$emit('sprite', sprite);
        });
      setTimeout(() => {
        this.updateMapZoom(map.getZoom());
        const newbbox = bbox(this.geojson.area);
        this.$emit('updateBounds', newbbox);
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
