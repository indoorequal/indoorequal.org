<template>
  <v-app>
    <v-navigation-drawer
      v-model="menu"
      width="300"
      temporary
      app
    >
      <div class="pa-3">
        <h1 class="display-1">indoor=</h1>
        <p class="mt-2 mb-1">indoor= is a map that display indoor data from <a href="https://openstreetmap.org/">OpenStreetMap</a>.</p>
      </div>
      <v-list>
        <v-list-item href="https://github.com/indoorequal/">
          <v-list-item-icon>
            <svg style="width:24px;height:24px;">
              <path fill="#6F6F6F" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path>
            </svg>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="body-1">GitHub</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <MglMap
        :center="mapCenter"
        :zoom="zoom"
        :map-style="mapStyle"
        hash="map"
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
      <v-card class="menu-search d-flex align-center pa-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              @click="toggleMenu"
              v-on="on"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <span>Menu</span>
        </v-tooltip>
        <geocoder-input
          class="ml-2"
          @select="centerMap"
        />
      </v-card>
      <img
        v-for="(icon, key) in icons"
        v-show="false"
        :ref="key"
        :src="icon"
     />
    </v-content>
  </v-app>
</template>

<script>
import { MglMap, MglNavigationControl, MglVectorLayer } from 'vue-mapbox/dist/vue-mapbox.umd';
import { apiKey } from '../config.json';
import LevelControl from './level_control';
import GeocoderInput from './geocoder';
import icons from '../icons/*.svg';

export default {
  components: {
    GeocoderInput,
    LevelControl,
    MglMap,
    MglNavigationControl,
    MglVectorLayer
  },

  data() {
    const hash = new URLSearchParams(window.location.hash.replace('#', ''));
    const level = parseInt(hash.get('level') || 0, 10);
    return {
      icons,
      mapStyle: `https://api.maptiler.com/maps/bright/style.json?key=${apiKey}`,
      mapCenter: { lat: 48.84108, lng: 2.32034 },
      minZoom: 17,
      zoom: 10,
      indoorSource: {
        url: 'https://tiles.indoorequal.org/'
      },
      level,
      menu: false
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
            "!=",
            "class",
            "level"
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
            "!=",
            "class",
            "level"
          ],
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

  watch: {
    level(level) {
       const hash = new URLSearchParams(window.location.hash.replace('#', ''));
       window.location.hash = `map=${hash.get('map')}&level=${level}`;
    }
  },

  methods: {
    registerIcons({ map }) {
      this.map = map;
      for (let icon in this.icons) {
        if (map.hasImage(icon)) {
          map.updateImage(icon, this.$refs[icon][0]);
        } else {
          map.addImage(icon, this.$refs[icon][0]);
        }
      }
    },

    centerMap(bbox) {
      this.map.fitBounds(bbox, { duration: 0 });
    },

    toggleMenu() {
      this.menu = !this.menu;
    }
  }
};
</script>

<style>
html {
  overflow-y: auto;
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
.menu-search {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
