<template>
  <v-card class="d-flex align-center pa-2">
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
          :href="`https://openlevelup.net/?l=${mapLevel}#${mapZoom}/${mapCenter.lat}/${mapCenter.lng}`"
        >
          <v-list-item-title>OpenLevelUp!</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card>
</template>

<script>
import GeocoderInput from './geocoder';

export default {
  components: {
    GeocoderInput
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

    value: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    editDisabled() {
      return this.mapZoom < this.minZoom;
    }
  },

  methods: {
    openJOSM() {
      const bounds = this.mapBounds;
      fetch(`http://localhost:8111/load_and_zoom?left=${bounds[0]}&right=${bounds[2]}&top=${bounds[3]}&bottom=${bounds[1]}`).catch(() => {
        alert("Could not talk to JOSM. Ensure it's running");
      });
    },

    toggleMenu() {
      this.$emit('input', !this.value);
    },

    updateBounds(bbox) {
      this.$emit('updateBounds', bbox);
    }
  }
}
</script>
