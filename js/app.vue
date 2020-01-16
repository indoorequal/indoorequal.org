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
          class="mx-2"
          @select="updateBounds"
        />
        <v-menu>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <div v-on="tooltip">
                  <v-btn
                    :disabled="editDisabled"
                    icon
                    v-on="menu"
                  >
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>{{ editDisabled ? 'Zoom in to edit' : 'Edit' }}</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              :href="`https://www.openstreetmap.org/edit?editor=id#map=${mapZoom}/${mapCenter.lat}/${mapCenter.lng}`"
            >
              <v-list-item-title>iD</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openJOSM">
              <v-list-item-title>JOSM</v-list-item-title>
            </v-list-item>
            <v-list-item
              :href="`https://osminedit.pavie.info/#${mapZoom}/${mapCenter.lat}/${mapCenter.lng}`"
            >
              <v-list-item-title>OsmInEdit</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              :href="`https://openlevelup.net/#${mapZoom}/${mapCenter.lat}/${mapCenter.lng}`"
            >
              <v-list-item-title>OpenLevelUp!</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card>
    </v-content>
  </v-app>
</template>

<script>
import GeocoderInput from './geocoder';
import IndoorMap from './map';
import IndoorSidebar from './sidebar';

export default {
  components: {
    GeocoderInput,
    IndoorMap,
    IndoorSidebar
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

  computed: {
    editDisabled() {
      return this.mapZoom < this.minZoom;
    }
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

    openJOSM() {
      const bounds = this.mapBounds;
      fetch(`http://localhost:8111/load_and_zoom?left=${bounds[0]}&right=${bounds[2]}&top=${bounds[3]}&bottom=${bounds[1]}`).catch(() => {
        alert("Could not talk to JOSM. Ensure it's running");
      });
    },

    toggleMenu() {
      this.menu = !this.menu;
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
.menu-search {
  left: 10px;
  position: absolute;
  top: 10px;
}
</style>
