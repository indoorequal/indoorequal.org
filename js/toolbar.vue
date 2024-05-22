<template>
  <v-card class="d-flex align-center pa-1">
    <v-tooltip
      :disabled="menu"
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          flat
          @click="openMenu"
          v-bind="props"
        >
          <v-badge
            :model-value="hasUnreadNews"
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
      @updateBounds="updateBounds"
    />
    <v-menu v-model="editOpen">
      <template v-slot:activator="{ props: menu }">
        <v-tooltip location="bottom" :disabled="editOpen">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              :disabled="editDisabled"
              icon
              variant="plain"
              v-bind="mergeProps(tooltip, menu)"
              >
              <v-icon>{{ mdiPencilOutline }}</v-icon>
            </v-btn>
          </template>
          <span>{{ editDisabled ? $t('toolbar.zoom_to_edit') : $t('toolbar.edit') }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-subheader>{{ $t('toolbar.edit') }}</v-list-subheader>
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
        <v-list-subheader>{{ $t('toolbar.view') }}</v-list-subheader>
        <v-list-item :href="OpenLevelUpUrl">
          <v-list-item-title>OpenLevelUp!</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card>
</template>

<script>
import { mergeProps } from 'vue';
import { mdiPencilOutline } from '@mdi/js';
import GeocoderInput from './geocoder';
import { useNews } from './news';
import equalLogo from 'data-url:../icons/equal.svg';
export default {
  components: {
    GeocoderInput
  },

  setup() {
    const { hasUnreadNews } = useNews();
    return { hasUnreadNews, mergeProps };
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

    menu: {
      type: String,
    }
  },

  data() {
    return { equalLogo, mdiPencilOutline, editOpen: false };
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
      this.$emit('update:menu', '');
    },

    updateBounds(bbox) {
      this.$emit('updateBounds', bbox);
    }
  }
}
</script>
