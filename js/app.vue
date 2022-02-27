<template>
  <v-app
    :class="{ xs: $vuetify.breakpoint.xsOnly }"
    @dragover.native.prevent
    @drop.native="onDropPreview"
  >
    <indoor-sidebar
      v-model="menu"
      @openPreview="openPreview"
    />
    <v-main>
      <indoor-map
        :map-bounds.sync="mapBounds"
        :map-center.sync="mapCenter"
        :map-level.sync="mapLevel"
        :map-zoom.sync="mapZoom"
        :new-map-bounds="newMapBounds"
        :new-map-center="newMapCenter"
        :preview="preview"
        :geojson="geojsonPreview"
        @clickPoi="clickPoi"
        @sprite="updateSprite"
        @updateBounds="updateBounds"
      >
        <MglMarker
          v-if="poiCoordinates.length > 0"
          :coordinates="poiCoordinates"
          color="#6667ad"
        />
      </indoor-map>
      <v-chip
        v-if="!preview && mapZoom < indoorMinZoom"
        color="primary"
        class="zoom-chip"
        @click="mapZoom = indoorMinZoom"
      >{{ $t('zoom') }}</v-chip>
      <v-snackbar
        v-model="errorPreview"
        bottom
        color="red"
      >{{ $t('preview.error', { msg: errorPreviewMessage }) }}</v-snackbar>
      <div class="indoor-toolbar">
        <indoor-toolbar
          v-if="!preview"
          v-model="menu"
          :map-bounds="mapBounds"
          :map-center="mapCenter"
          :map-level="mapLevel"
          :map-zoom="mapZoom"
          :indoor-min-zoom="indoorMinZoom"
          @updateBounds="updateBounds"
        />
        <indoor-preview-toolbar
          v-else
          :filePreview="filePreview"
          @openPreview="openPreview"
          @closePreview="closePreview"
        />
        <indoor-discover
          v-if="discover && !preview"
          class="indoor-discover"
          @explore="openExplore"
          @close="closeDiscover"
        />
        <indoor-poi
          v-model="poi"
          :sprite="sprite"
          :poi-fetcher="poiFetcher"
          class="indoor-poi"
          @poiCoordinates="setPoiCoordinates"
        />
      </div>
      <indoor-preview-confirm
        v-if="confirmPreview"
        v-model="confirmPreview"
        :origin="confirmPreviewOrigin"
        :action="confirmPreviewAction"
        @openPreview="openPreview"
      />
    </v-main>
  </v-app>
</template>

<script>
import { MglMarker } from 'vue-mapbox/dist/vue-mapbox.umd';
import { tilesUrl, indoorEqualApiKey, indoorMinZoom } from '../config.json';
import IndoorDiscover from './discover';
import IndoorMap from './map';
import IndoorPoi from './poi';
import IndoorSidebar from './sidebar';
import IndoorToolbar from './toolbar';

const fetchPoiGeojson = async function(poiInfo) {
  const poiGeojsonRequest = await fetch(`${tilesUrl}poi/${poiInfo}?key=${indoorEqualApiKey}`);
  return poiGeojsonRequest.json();
}

const MAP_VIEW_LOCAL_STORAGE = 'mapView';
const DISCOVER_LOCAL_STORAGE = 'discover';
const POI_PARAM = 'poi';
const LEVEL_PARAM = 'level';
const MENU_PARAM = 'menu';
const URL_PARAM = 'url';

const IndoorPreviewToolbar = () => import('./preview/preview_toolbar');
const IndoorPreviewConfirm = () => import('./preview/preview_confirm');

const downloadFromUrl = function (url) {
  return fetch(url)
    .then(r => r.arrayBuffer())
    .then(b => {
      const filename = new URL(url).pathname.split('/').reverse()[0];
      return new File([b], filename);
    });
};

export default {
  components: {
    IndoorDiscover,
    IndoorMap,
    IndoorPoi,
    IndoorPreviewConfirm,
    IndoorPreviewToolbar,
    IndoorSidebar,
    IndoorToolbar,
    MglMarker
  },

  data() {
    return {
      mapBounds: [],
      mapCenter: { lat: 37.68, lng: -2.37 },
      mapLevel: '0',
      mapZoom: 1.2,
      poi: '',
      poiCoordinates: [],
      menu: null,
      indoorMinZoom: indoorMinZoom,
      newMapBounds: [],
      newMapCenter: {},
      sprite: null,
      discover: true,
      errorPreview: false,
      errorPreviewMessage: '',
      preview: false,
      filePreview: null,
      urlPreview: null,
      confirmPreview: false,
      confirmPreviewAction: null,
      confirmPreviewOrigin: null,
      confirmPreviewAllowedOrigins: [],
      geojsonPreview: {},
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
    if (hashParams.has(MENU_PARAM)) {
      this.menu = hashParams.get(MENU_PARAM);
    }
    if (hashParams.has(URL_PARAM)) {
      const url = hashParams.get(URL_PARAM);
      this.confirmBeforePreview(url, () => {
        return downloadFromUrl(url);
      });
    }
    if (localStorage.getItem(DISCOVER_LOCAL_STORAGE)) {
      this.discover = localStorage.getItem(DISCOVER_LOCAL_STORAGE) === 'true';
    }
    this.registerMessageListener();
    this.loadInitialLocation(hashParams);
  },

  computed: {
    poiFetcher() {
      return (poi) => {
        if (this.preview) {
          const result = this.geojsonPreview.poi.features.find(({ properties: { id } }) => id === poi);
          result.properties.tags = result.properties;
          return result;
        } else {
          return fetchPoiGeojson(poi);
        }
      };
    }
  },

  watch: {
    menu() {
      this.updateHash();
    },

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
      const poi = (this.poi !== '' && !this.preview) ? `&${POI_PARAM}=${this.poi}` : '';
      const menu = this.menu !== null ? `&${MENU_PARAM}=${this.menu}` : '';
      window.location.hash = `map=${hash.get('map')}&${LEVEL_PARAM}=${this.mapLevel}${poi}${menu}`;
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
      this.menu = 'explore';
    },

    closeDiscover() {
      this.discover = false;
    },

    saveDiscoverValue() {
      localStorage.setItem(DISCOVER_LOCAL_STORAGE, this.discover);
    },

    onDropPreview(e) {
      e.preventDefault();

      const files = e.dataTransfer.files;
      this.openPreview(files[0]);
    },

    async openPreview(file) {
      this.menu = null;
      this.preview = false;
      this.filePreview = file;
      try {
        this.geojsonPreview = await (await import('./preview/preview')).transform(file);
        if (this.geojsonPreview.area.features.length === 0) {
          this.menu = 'preview';
          this.errorPreviewMessage = this.$t('preview.error_no_level');
          this.errorPreview = true;
        } else {
          this.poi = '';
          this.preview = true;
          plausible('Open preview');
        }
      } catch (e) {
        this.menu = 'preview';
        this.errorPreviewMessage = this.$t('preview.error_bad_file');
        this.errorPreview = true;
      }
    },

    closePreview() {
      this.preview = false;
      this.geojsonPreview = {};
      this.poi = '';
    },

    registerMessageListener() {
      window.addEventListener('message', (e) => {
        const data = e.data;
        switch (data.command) {
        case 'preview':
          this.confirmBeforePreview(e.origin, () => {
            if (data.file) {
              return data.file;
            } else if (data.url) {
              return downloadFromUrl(data.url);
            }
          });
          break;
        case 'level':
          this.mapLevel = e.data.level;
          break;
        case 'coordinates':
          if (e.data.bbox) {
            this.newMapBounds = e.data.bbox;
          } else if (e.data.center && e.data.zoom) {
            this.newMapCenter = e.data.center;
            this.mapZoom = e.data.zoom;
          }
          break;
        }
      });
      const otherWindow = window.opener || window.parent;
      if (otherWindow !== window) {
        otherWindow.postMessage({ event: 'ready' }, '*');
      }
    },

    async confirmBeforePreview(origin, action) {
      if (this.confirmPreviewAllowedOrigins.includes(origin)) {
        const file = await action();
        return this.openPreview(file);
      }
      this.confirmPreviewAction = () => {
        this.confirmPreviewAllowedOrigins.push(origin);
        return action()
      };
      this.confirmPreviewOrigin = origin;
      this.confirmPreview = true;
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
.zoom-chip {
  position: fixed;
  bottom: 1.4rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>
