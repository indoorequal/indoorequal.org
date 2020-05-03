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
      />
      <indoor-toolbar
        v-model="menu"
        :map-bounds="mapBounds"
        :map-center="mapCenter"
        :map-level="mapLevel"
        :map-zoom="mapZoom"
        :min-zoom="minZoom"
        class="indoor-toolbar"
        @updateBounds="updateBounds"
      />
    </v-content>
  </v-app>
</template>

<script>
import IndoorMap from './map';
import IndoorSidebar from './sidebar';
import IndoorToolbar from './toolbar';

const MAP_VIEW_LOCAL_STORAGE = 'mapView';

export default {
  components: {
    IndoorMap,
    IndoorSidebar,
    IndoorToolbar
  },

  data() {
    return {
      loadMap: false,
      mapBounds: [],
      mapCenter: { lat: 46.8, lng: 5 },
      mapLevel: "0",
      mapZoom: 5,
      menu: false,
      minZoom: 17,
      newMapBounds: []
    };
  },

  mounted() {
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    if (hashParams.has('level')) {
      this.mapLevel = hashParams.get('level');
    }
    this.loadInitialLocation(hashParams).finally(() => {
      this.loadMap = true;
    });
  },

  watch: {
    mapLevel(mapLevel) {
      const hash = new URLSearchParams(window.location.hash.replace('#', ''));
      window.location.hash = `map=${hash.get('map')}&level=${mapLevel}`;
      this.saveMapView();
    },

    mapZoom() {
      this.saveMapView();
    },

    mapCenter() {
      this.saveMapView();
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
}
.xs .indoor-toolbar {
  width: calc(100% - 20px);
}
.xs .mapboxgl-ctrl-top-right {
  margin-top: 70px;
}
</style>
