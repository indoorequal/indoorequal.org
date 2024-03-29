<template>
  <v-card class="d-flex align-center pa-2">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          @click="openMenu"
          v-on="on"
        >
          <v-badge
            :value="hasNews"
            dot
          >
            <img
              :src="equalLogo"
              alt="indoor="
              width="36"
            />
          </v-badge>
        </v-btn>
      </template>
      <span>{{ $t('toolbar.menu') }}</span>
    </v-tooltip>
    <geocoder-input
      class="mx-2"
      @select="updateBounds"
    />
    <v-menu>
      <template v-slot:activator="{ on: menu, value }">
        <v-tooltip bottom :disabled="value">
          <template v-slot:activator="{ on: tooltip }">
            <div v-on="tooltip">
              <v-btn
                :disabled="editDisabled"
                icon
                v-on="menu"
              >
                <v-icon>{{ mdiPencilOutline }}</v-icon>
              </v-btn>
            </div>
          </template>
          <span>{{ editDisabled ? $t('toolbar.zoom_to_edit') : $t('toolbar.edit') }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-subheader>{{ $t('toolbar.edit') }}</v-subheader>
        <v-list-item :href="OSMUrl">
          <v-list-item-title>iD</v-list-item-title>
        </v-list-item>
        <v-list-item @click="openJOSM">
          <v-list-item-title>JOSM</v-list-item-title>
        </v-list-item>
        <v-list-item :href="VespucciUrl">
          <v-list-item-title>Vespucci</v-list-item-title>
        </v-list-item>
        <v-list-item :href="OsmInEditUrl">
          <v-list-item-title>OsmInEdit</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-subheader>{{ $t('toolbar.view') }}</v-subheader>
        <v-list-item :href="OpenLevelUpUrl">
          <v-list-item-title>OpenLevelUp!</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card>
</template>

<script>
import { mdiPencilOutline } from '@mdi/js';
import GeocoderInput from './geocoder';
import news from './news';
import equalLogo from 'data-url:../icons/equal.svg';

export default {
  components: {
    GeocoderInput
  },

  mixins: [news],

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
      type: String,
      required: true
    },

    mapZoom: {
      type: Number,
      required: true
    },

    indoorMinZoom: {
      type: Number,
      required: true
    },

    value: {
      type: String,
    }
  },

  data() {
    return { equalLogo, mdiPencilOutline };
  },

  computed: {
    editDisabled() {
      return this.mapZoom < this.indoorMinZoom;
    },

    JOSMParams() {
      const bounds = this.mapBounds;
      return `load_and_zoom?left=${bounds[0]}&right=${bounds[2]}&top=${bounds[3]}&bottom=${bounds[1]}`;
    },

    JOSMUrl() {
      return `http://localhost:8111/${this.JOSMParams}`;
    },

    OSMUrl() {
      return `https://www.openstreetmap.org/edit?editor=id#map=${this.mapZoom}/${this.mapCenter.lat}/${this.mapCenter.lng}`;
    },

    OsmInEditUrl() {
      return `https://osminedit.pavie.info/#${this.mapZoom}/${this.mapCenter.lat}/${this.mapCenter.lng}`;
    },

    OpenLevelUpUrl() {
      return `https://openlevelup.net/?l=${this.mapLevel}#${this.mapZoom}/${this.mapCenter.lat}/${this.mapCenter.lng}`;
    },

    VespucciUrl() {
      return `josm:/${this.JOSMParams}`;
    }
  },

  methods: {
    openJOSM() {
      fetch(this.JOSMUrl).catch(() => {
        alert("Could not talk to JOSM. Ensure it's running");
      });
    },

    openMenu() {
      this.$emit('input', '');
    },

    updateBounds(bbox) {
      this.$emit('updateBounds', bbox);
    }
  }
}
</script>
