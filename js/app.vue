<template>
  <v-app :class="{ xs: $vuetify.breakpoint.xsOnly }">
    <indoor-sidebar v-model="menu" />
    <v-content>
      <indoor-map
        v-if="loadMap"
        :map-bounds.sync="mapBounds"
        :map-center.sync="mapCenter"
        :map-level.sync="mapLevel"
        :map-zoom.sync="mapZoom"
        :new-map-bounds="newMapBounds"
        @clickPoi="clickPoi"
        @sprite="updateSprite"
      >
        <MglMarker
          v-if="poiCoordinates.length > 0"
          :coordinates="poiCoordinates"
          color="#6667ad"
        />
      </indoor-map>
      <div class="indoor-toolbar">
        <indoor-toolbar
          v-model="menu"
          :map-bounds="mapBounds"
          :map-center="mapCenter"
          :map-level="mapLevel"
          :map-zoom="mapZoom"
          :min-zoom="minZoom"
          @updateBounds="updateBounds"
        />
        <indoor-poi
          v-model="poi"
          :sprite="sprite"
          class="indoor-poi"
          @poiCoordinates="setPoiCoordinates"
        />
      </div>
    </v-content>
  </v-app>
</template>

<script>
import { MglMarker } from 'vue-mapbox/dist/vue-mapbox.umd';
import IndoorMap from './map';
import IndoorPoi from './poi';
import IndoorSidebar from './sidebar';
import IndoorToolbar from './toolbar';

const MAP_VIEW_LOCAL_STORAGE = 'mapView';
const POI_PARAM = 'poi';
const LEVEL_PARAM = 'level';

export default {
  components: {
    IndoorMap,
    IndoorPoi,
    IndoorSidebar,
    IndoorToolbar,
    MglMarker
  },

  data() {
    return {
      loadMap: false,
      mapBounds: [],
      mapCenter: { lat: 46.8, lng: 5 },
      mapLevel: '0',
      mapZoom: 5,
      poi: '',
      poiCoordinates: [],
      menu: false,
      minZoom: 17,
      newMapBounds: [],
      sprite: null
    };
  },

  mounted() {
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    if (hashParams.has(LEVEL_PARAM)) {
      this.mapLevel = hashParams.get(LEVEL_PARAM);
    }
    if (hashParams.has(POI_PARAM)) {
      this.poi = hashParams.get(POI_PARAM);
    }
    this.loadInitialLocation(hashParams).finally(() => {
      this.loadMap = true;
    });
  },

  watch: {
    mapLevel(mapLevel) {
      this.updateHash();
    },

    mapZoom() {
      this.saveMapView();
    },

    mapCenter() {
      this.saveMapView();
    },

    poi(poi) {
      this.updateHash();
      if (poi == '') {
        this.poiCoordinates = [];
      }
    }
  },

  methods: {
    loadInitialLocation(hashParams) {
      if (hashParams.has('map')) {
        return Promise.resolve();
      }
      const savedMapView = this.savedMapView();
      if (savedMapView) {
        const { center, zoom, level } = JSON.parse(savedMapView);
        this.mapCenter = center;
        this.mapZoom = zoom;
        this.mapLevel = level;
        return Promise.resolve();
      }
      return this.centerMapViaGeoIP();
    },

    centerMapViaGeoIP() {
      return fetch('https://geo.indoorequal.org/me')
        .then(res => res.json())
        .then(json => {
          this.mapCenter = { lat: json.ll[0], lng: json.ll[1] };
          this.mapZoom = 13;
        });
    },

    updateBounds(bbox) {
      this.newMapBounds = bbox;
    },

    savedMapView() {
      return localStorage.getItem(MAP_VIEW_LOCAL_STORAGE);
    },

    saveMapView() {
      localStorage.setItem(MAP_VIEW_LOCAL_STORAGE, JSON.stringify({ center: this.mapCenter, zoom: this.mapZoom, level: this.mapLevel }));
    },

    updateHash() {
      const hash = new URLSearchParams(window.location.hash.replace('#', ''));
      const poi = this.poi !== '' ? `&${POI_PARAM}=${this.poi}` : '';
      window.location.hash = `map=${hash.get('map')}&${LEVEL_PARAM}=${this.mapLevel}${poi}`;
      this.saveMapView();
    },

    clickPoi(id) {
      this.poi = id;
    },

    setPoiCoordinates(coordinates) {
      this.poiCoordinates = coordinates;
    },

    updateSprite(sprite) {
      this.sprite = sprite;
    }
  }
};
</script>

<style>
html {
  overflow-y: auto;
}
.indoor-toolbar {
  left: 10px;
  position: absolute;
  top: 10px;
  width: 370px;
}
.xs .indoor-toolbar {
  width: calc(100% - 20px);
}
.xs .mapboxgl-ctrl-top-right {
  margin-top: 70px;
}
.indoor-poi {
  margin-top: 1rem;
  z-index: 6;
}
</style>
