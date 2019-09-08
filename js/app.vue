<template>
  <div>
    <header>
      <h1><a href="https://github.com/francois2metz/osm-indoor-viewer">OSM Indoor Viewer</a></h1>
    </header>
    <MglMap
      :max-bounds="mapMaxBounds"
      :center="mapCenter"
      :zoom="zoom"
      :map-style="mapStyle"
      :hash="true"
      @load="registerIcons"
    >
      <MglNavigationControl :show-compass="true" />
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
        v-model="level"
        source="indoor"
        layer="area"
      />
    </MglMap>
    <img v-for="(icon, key) in icons"
         v-show="false"
         :ref="key"
         :src="icon"
    />
  </div>
</template>

<script>
import { MglMap, MglNavigationControl, MglVectorLayer } from 'vue-mapbox/dist/vue-mapbox.umd';
import LevelControl from './level_control';
import icons from '../icons/*.svg';

export default {
  components: {
    MglMap,
    MglNavigationControl,
    MglVectorLayer,
    LevelControl
  },

  data() {
    return {
      icons,
      mapMaxBounds: [[-1.9774289, 47.3505754], [4.2723108, 49.622590]],
      mapStyle: 'https://api.maptiler.com/maps/bright/style.json?key=T7HQrA4a6k5eOxDGD6qp',
      mapCenter: { lat: 48.84108, lng: 2.32034 },
      minZoom: 17,
      zoom: 10,
      indoorSource: {
        url: 'https://tiles.osmontrouge.fr/data/indoor.json'
      },
      level: 0
    };
  },

  computed: {
    indoorLayerBackground() {
      return {
        type: "background",
        minzoom: this.minZoom,
        "filter": [
          "all",
          [
            "==",
            "level",
            this.level
          ]
        ],
        paint: {
          "background-color": "white"
        }
      };
    },

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
            "==",
            "level",
            this.level
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
            "==",
            "level",
            this.level
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
            this.level
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
            this.level
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

  methods: {
    registerIcons({ map }) {
      for (let icon in this.icons) {
        if (map.hasImage(icon)) {
          map.updateImage(icon, this.$refs[icon][0]);
        } else {
          map.addImage(icon, this.$refs[icon][0]);
        }
      }
    }
  }
};
</script>

<style>
html, body { padding: 0; margin: 0 }

header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: white;
  border-color: gray;
  border-style: solid;
  border-width: 0px;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-bottom-right-radius: 5px;
  padding: 5px;
}

header h1 {
  font-size: 1.5rem;
  margin: 0;
}

.mgl-map-wrapper {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.mgl-map-wrapper .mapboxgl-map {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
