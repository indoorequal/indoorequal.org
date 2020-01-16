<template>
  <v-app>
    <v-navigation-drawer
      v-model="menu"
      width="300"
      temporary
      app
    >
      <div
        v-if="explore"
        class="pa-3"
      >
        <h2 class="title flex align-center">
          <v-btn
            icon
            @click="toggleExplore"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          Explore
        </h2>
        <p class="my-2">This list come from the examples section of the <a href="https://wiki.openstreetmap.org/wiki/Simple_Indoor_Tagging">Simple Indoor Tagging wiki page</a>.</p>
        <explore-list @click="toggleMenu" />
      </div>
      <template v-else>
        <div class="pa-3">
          <h1 class="display-1">indoor=</h1>
          <p class="mt-2 mb-1">indoor= is a map that display indoor data from <a href="https://openstreetmap.org/">OpenStreetMap</a>.</p>
        </div>
        <v-list>
          <v-list-item @click="toggleExplore">
            <v-list-item-icon>
              <v-icon>mdi-map-marker-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Explore</v-list-item-title>
              <v-list-item-subtitle>Showcase indoor location</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item href="https://github.com/indoorequal/">
            <v-list-item-icon>
              <svg style="width:24px;height:24px;">
                <path fill="#6F6F6F" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path>
              </svg>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>GitHub</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
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
import ExploreList from './explore_list';
import GeocoderInput from './geocoder';
import IndoorMap from './map';

export default {
  components: {
    ExploreList,
    GeocoderInput,
    IndoorMap,
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
      newMapBounds: [],
      explore: false
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

    toggleExplore() {
      this.explore = !this.explore;
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
