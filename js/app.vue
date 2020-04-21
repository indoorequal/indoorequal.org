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
    if (!hashParams.has('map')) {
      this.centerMapViaGeoIP()
        .finally(() => {
          this.loadMap = true;
        });
    } else {
      this.loadMap = true;
    }
  },

  watch: {
    mapLevel(mapLevel) {
      const hash = new URLSearchParams(window.location.hash.replace('#', ''));
      window.location.hash = `map=${hash.get('map')}&level=${mapLevel}`;
    }
  },

  methods: {
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
