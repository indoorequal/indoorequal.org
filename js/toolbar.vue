<template>
  <v-card class="d-flex align-center pa-1">
    <v-tooltip
      :disabled="menu !== null"
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

<script setup>
import { mergeProps, ref, computed } from 'vue';
import { mdiPencilOutline } from '@mdi/js';
import GeocoderInput from './geocoder';
import { useNews } from './news';
import equalLogo from 'data-url:../icons/equal.svg';

const { hasUnreadNews } = useNews();

const props = defineProps({
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
});

const editOpen = ref(false);

const editDisabled = computed(() => {
  return props.mapZoom < props.indoorMinZoom;
})

const JOSMParams = computed(() => {
  const [left, bottom, right, top] = props.mapBounds;
  return `load_and_zoom?left=${left}&right=${right}&top=${top}&bottom=${bottom}`;
});

const JOSMUrl = computed(() => {
  return `http://localhost:8111/${JOSMParams.value}`;
});

const OSMUrl = computed(() => {
  return `https://www.openstreetmap.org/edit?editor=id#map=${props.mapZoom}/${props.mapCenter.lat}/${props.mapCenter.lng}`;
});

const OsmInEditUrl = computed(() => {
  return `https://osminedit.pavie.info/#${props.mapZoom}/${props.mapCenter.lat}/${props.mapCenter.lng}`;
});

const OpenLevelUpUrl = computed(() => {
  return `https://openlevelup.net/?l=${props.mapLevel}#${props.mapZoom}/${props.mapCenter.lat}/${props.mapCenter.lng}`;
});

const VespucciUrl = computed(() => {
  return `josm:/${JOSMParams.value}`;
});

const openJOSM = function() {
  fetch(JOSMUrl.value).catch(() => {
    alert("Could not talk to JOSM. Ensure it's running");
  });
};

const menu = defineModel('menu', { type: [String, null] });

const openMenu = function() {
  menu.value = '';
};

const emit = defineEmits(['updateBounds']);
const updateBounds = function(bbox) {
  emit('updateBounds', bbox);
}
</script>
