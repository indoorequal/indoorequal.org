<template>
  <v-app>
    <indoor-sidebar v-model="menu" />
    <v-content>
      <indoor-map
        :map-bounds.sync="mapBounds"
        :map-center.sync="mapCenter"
        :map-level.sync="mapLevel"
        :map-zoom.sync="mapZoom"
        :min-zoom="minZoom"
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

export default {
  components: {
    IndoorMap,
    IndoorSidebar,
    IndoorToolbar
  },

  data() {
    const hash = new URLSearchParams(window.location.hash.replace('#', ''));
    const mapView = this.savedCurrentView();
    const level = parseInt(hash.get('level') || mapView.level, 10);
    return {
      mapBounds: [],
      mapCenter: { lat: mapView.lat, lng: mapView.lng },
      mapLevel: level,
      mapZoom: mapView.zoom,
      menu: false,
      minZoom: 17,
      newMapBounds: []
    };
  },

  watch: {
    mapLevel(mapLevel) {
      const hash = new URLSearchParams(window.location.hash.replace('#', ''));
      window.location.hash = `map=${hash.get('map')}&level=${mapLevel}`;
      this.saveCurrentView();
    },

    mapZoom() {
      this.saveCurrentView();
    },

    mapCenter() {
      this.saveCurrentView();
    }
  },

  methods: {
    updateBounds(bbox) {
      this.newMapBounds = bbox;
    },

    savedCurrentView() {
      const mapView = localStorage.getItem('mapView');
      if (mapView) {
        return JSON.parse(mapView);
      }
      return {
        lat: 48.84108,
        lng: 2.32034,
        zoom: 10,
        level: 0
      };
    },

    saveCurrentView() {
      localStorage.setItem('mapView', JSON.stringify({ ...this.mapCenter, zoom: this.mapZoom, level: this.mapLevel }));
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
</style>
