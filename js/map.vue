<template>
  <MglMap
    :center="mapCenter"
    :zoom="mapZoom"
    :map-style="mapStyle"
    :track-resize="true"
    :attribution-control="{ customAttribution: '' }"
    hash="map"
    @map:load="load"
    @update:center="updateMapCenter"
    @update:zoom="updateMapZoom"
  >
    <template v-if="loaded">
      <MglNavigationControl />
      <MglGeolocateControl />
      <heatmap-control v-if="!preview" />
      <level-control
        :key="`level-control-${preview}`"
        :value="mapLevel"
        position="bottom-right"
        @input="updateMapLevel"
        @levels="(levels) => $emit('update:mapLevels', levels)"
      />
      <language-control />
      <slot />
    </template>
  </MglMap>
</template>

<script>
import { MglMap, MglNavigationControl, MglGeolocateControl } from '@indoorequal/vue-maplibre-gl';
import { computed } from 'vue';
import IndoorEqual from 'maplibre-gl-indoorequal';
import { bbox } from '@turf/bbox';
import { mapStyle } from './maptiler';
import { indoorEqualApiKey, tilesUrl } from '../config.json';
import LanguageControl from './controls/language_control';
import LevelControl from './controls/level_control';
import HeatmapControl from './controls/heatmap_control';

export default {
  components: {
    HeatmapControl,
    LevelControl,
    LanguageControl,
    MglGeolocateControl,
    MglMap,
    MglNavigationControl
  },

  emits: ['clickPoi', 'updateBounds', 'sprite', 'update:mapCenter', 'update:mapBounds', 'update:mapLevels', 'update:mapZoom', 'update:mapLevel'],

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

    newMapCenter: {
      type: Object,
      required: false,
      default() { return {}; }
    },

    preview: {
      type: Boolean,
      required: true,
    },

    geojson: {
      type: Object,
      required: false,
      default() { return {}; }
    }
  },

  provide() {
    return {
      indoorequal: computed(() => this.indoorEqualInstance )
    };
  },

  data() {
    return {
      mapStyle: mapStyle(),
      loaded: false,
      indoorEqualInstance: null,
    };
  },

  watch: {
    newMapBounds(bbox) {
      this.map.fitBounds(bbox, { duration: 0 });
    },

    newMapCenter(center) {
      this.map.setCenter(center);
    },

    preview() {
      this.indoorEqualInstance.remove();
      this.createIndoorEqualInstance();
      if (this.preview) {
        const newbbox = bbox(this.geojson.area);
        this.$emit('updateBounds', newbbox);
      }
    }
  },

  methods: {
    load({ map }) {
      this.map = map;
      this.createIndoorEqualInstance();
      this.indoorEqualInstance.loadSprite('/indoorequal')
        .then((sprite) => {
          this.$emit('sprite', sprite);
        });
      setTimeout(() => {
        this.updateMapZoom(map.getZoom());
      }, 100);
      this.loaded = true;
      this.map.on('mouseenter', 'indoor-poi-rank1', this.mouseenterLayer);
      this.map.on('click', 'indoor-poi-rank1', this.clickLayer);
      this.map.on('mouseleave', 'indoor-poi-rank1', this.mouseleaveLayer);
      this.map.on('mouseenter', 'indoor-poi-rank2', this.mouseenterLayer);
      this.map.on('click', 'indoor-poi-rank2', this.clickLayer);
      this.map.on('mouseleave', 'indoor-poi-rank2', this.mouseleaveLayer);
    },

    createIndoorEqualInstance() {
      let opts = { apiKey: indoorEqualApiKey, url: tilesUrl };
      if (this.preview) {
        opts = { geojson: this.geojson };
      }
      this.indoorEqualInstance = new IndoorEqual(this.map, opts);
    },

    mouseenterLayer() {
      this.map.getCanvas().style.cursor = 'pointer';
    },

    clickLayer(e) {
      const id = e.features[0].properties.id;
      this.$emit('clickPoi', id);
    },

    mouseleaveLayer() {
      this.map.getCanvas().style.cursor = '';
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
  },
};
</script>

<style>
.maplibregl-ctrl-bottom-left, .maplibregl-ctrl-bottom-right, .maplibregl-ctrl-top-left, .maplibregl-ctrl-top-right {
  position: fixed;
}
</style>
