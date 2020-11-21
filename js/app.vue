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
        <indoor-discover
          v-if="discover"
          class="indoor-discover"
          @explore="openExplore"
          @close="closeDiscover"
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
import IndoorDiscover from './discover';
import IndoorMap from './map';
import IndoorPoi from './poi';
import IndoorSidebar from './sidebar';
import IndoorToolbar from './toolbar';

const MAP_VIEW_LOCAL_STORAGE = 'mapView';
const DISCOVER_LOCAL_STORAGE = 'discover';
const POI_PARAM = 'poi';
const LEVEL_PARAM = 'level';

export default {
  components: {
    IndoorDiscover,
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
      sprite: null,
      discover: true,
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
    if (localStorage.getItem(DISCOVER_LOCAL_STORAGE)) {
      this.discover = localStorage.getItem(DISCOVER_LOCAL_STORAGE) == 'true';
    }
    this.loadInitialLocation(hashParams);
    this.loadMap = true;
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
    },

    discover() {
      this.saveDiscoverValue();
    },
  },

  methods: {
    loadInitialLocation(hashParams) {
      if (hashParams.has('map')) {
        return;
      }
      const savedMapView = this.savedMapView();
      if (savedMapView) {
        const { center, zoom, level } = JSON.parse(savedMapView);
        this.mapCenter = center;
        this.mapZoom = zoom;
        this.mapLevel = level;
      }
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
    },

    openExplore() {
      this.menu = true;
    },

    closeDiscover() {
      this.discover = false;
    },

    saveDiscoverValue() {
      localStorage.setItem(DISCOVER_LOCAL_STORAGE, this.discover);
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
.indoor-poi, .indoor-discover {
  margin-top: 1rem;
  z-index: 6;
}
</style>
