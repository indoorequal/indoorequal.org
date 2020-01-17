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
      <MglVectorLayer
        :source="indoorSource"
        :layer="indoorLayerPolygon"
        :clear-source="false"
        source-id="indoor"
        layer-id="indoor-polygon"
      />
      <MglVectorLayer
        :source="indoorSource"
        :layer="indoorLayerLine"
        :clear-source="false"
        source-id="indoor"
        layer-id="indoor-line"
      />
      <MglVectorLayer
        :source="indoorSource"
        :layer="indoorLayerTransportation"
        :clear-source="false"
        source-id="indoor"
        layer-id="indoor-transportation"
      />
      <MglVectorLayer
        :source="indoorSource"
        :layer="indoorLayerPoi"
        :clear-source="false"
        source-id="indoor"
        layer-id="indoor-poi"
      />
      <level-control
        :value="mapLevel"
        source="indoor"
        layer="area"
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
import { MglMap, MglNavigationControl, MglVectorLayer } from 'vue-mapbox/dist/vue-mapbox.umd';
import { apiKey, tilesUrl } from '../config.json';
import icons from '../mapicons/*.svg';
import LevelControl from './level_control';

export default {
  components: {
    LevelControl,
    MglMap,
    MglNavigationControl,
    MglVectorLayer
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
      type: Number,
      required: true
    },

    mapZoom: {
      type: Number,
      required: true
    },

    minZoom: {
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
      mapStyle: `https://api.maptiler.com/maps/bright/style.json?key=${apiKey}`,
      icons,
      indoorSource: { url: tilesUrl }
    };
  },

  computed: {
    indoorLayerPolygon() {
      return {
        type: "fill",
        "source-layer": "area",
        minzoom: this.minZoom,
        filter: [
          "all",
          [
            "==",
            "$type",
            "Polygon"
          ],
          [
            "!=",
            "class",
            "level"
          ],
          [
            "==",
            "level",
            this.mapLevel
          ]
        ],
        layout: {
          visibility: "visible"
        },
        paint: {
          "fill-color": "white"
        }
      };
    },

    indoorLayerLine() {
      return {
        "type": "line",
        "source-layer": "area",
        "minzoom": this.minZoom,
        "filter": [
          "all",
          [
            "!=",
            "class",
            "level"
          ],
          [
            "==",
            "level",
            this.mapLevel
          ]
        ],
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "line-color": "gray",
          "line-width": 1
        }
      };
    },

    indoorLayerTransportation() {
      return {
        "type": "line",
        "source-layer": "transportation",
        "minzoom": this.minZoom,
        "filter": [
          "all",
          [
            "==",
            "level",
            this.mapLevel
          ]
        ],
        "layout": {
          "visibility": "visible",
        },
        "paint": {
          "line-color": "gray",
          "line-dasharray": [
            0.4,
            0.75
          ],
          "line-width": {
            "base": 1.4,
            "stops": [
              [
                this.minZoom,
                2
              ],
              [
                this.minZoom+3,
                10
              ]
            ]
          }
        }
      };
    },

    indoorLayerPoi() {
      return {
        "type": "symbol",
        "source-layer": "poi",
        "minzoom": this.minZoom,
        "filter": [
          "all",
          [
            "==",
            "$type",
            "Point"
          ],
          [
            "==",
            "level",
            this.mapLevel
          ]
        ],
        "layout": {
          "icon-image": "{class}_11",
          "text-anchor": "top",
          "text-field": "{name:latin}\n{name:nonlatin}",
          "text-font": [
            "Noto Sans Regular"
          ],
          "text-max-width": 9,
          "text-offset": [
            0,
            0.6
          ],
          "text-padding": 2,
          "text-size": 12
        },
        "paint": {
          "text-color": "#666",
          "text-halo-blur": 0.5,
          "text-halo-color": "#ffffff",
          "text-halo-width": 1
        }
      };
    }
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
