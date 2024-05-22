<template>
  <v-navigation-drawer
    :model-value="menu !== null"
    width="350"
    temporary
    touchless
    @update:modelValue="updateValue"
  >
    <component
      v-if="hasSubSidebar"
      :is="componentName"
      @openPreview="(file) => this.$emit('openPreview', file)"
      @hideMenu="hideMenu"
      @close="updateMenu('')"
    />
    <template v-else>
      <div class="pa-3">
        <div class="d-flex align-center justify-space-between">
          <h1 class="display-1">
            <img
              :src="logo"
              alt="indoor="
              class="logo"
            />
          </h1>
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                flat
                @click="hideMenu"
                v-bind="props"
              >
                <v-icon>{{ mdiArrowExpandLeft }}</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("sidebar.collapse") }}</span>
          </v-tooltip>
        </div>
        <i18n-t keypath="sidebar.description" tag="p" class="mt-2 mb-1">
          <a href="https://openstreetmap.org/" target="_blank">{{ $t('sidebar.osm') }}</a>
        />
        </i18n-t>
      </div>
      <v-list lines="two">
        <v-list-item @click="display('explore')">
          <template v-slot:prepend>
            <v-icon>{{ mdiMapMarkerCircle }}</v-icon>
          </template>
          <v-list-item-title>{{ $t('sidebar.explore.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('sidebar.explore.subtitle') }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item @click="display('api')">
          <template v-slot:prepend>
            <v-icon>{{ mdiMap }}</v-icon>
          </template>
          <v-list-item-title>{{ $t('sidebar.api.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('sidebar.api.subtitle') }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item @click="display('news')">
          <template v-slot:prepend>
            <v-badge
              :model-value="hasUnreadNews"
              dot
            >
              <v-icon>{{ mdiNewspaperVariantOutline }}</v-icon>
            </v-badge>
          </template>
            <v-list-item-title>{{ $t('sidebar.news.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('sidebar.news.subtitle') }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item @click="display('about')">
          <template v-slot:prepend>
            <v-icon>{{ mdiInformationOutline }}</v-icon>
          </template>
          <v-list-item-title>{{ $t('sidebar.about.title') }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="display('preview')">
          <template v-slot:prepend>
            <v-icon>{{ mdiPuzzleCheck }}</v-icon>
          </template>
          <v-list-item-title>
            {{ $t('sidebar.preview.title') }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ $t('sidebar.preview.subtitle') }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          href="https://taginfo.indoorequal.org"
          target="_blank"
        >
          <template v-slot:prepend>
            <v-icon>{{ mdiTag }}</v-icon>
          </template>
          <template v-slot:append>
            <v-icon>{{ mdiOpenInNew }}</v-icon>
          </template>
          <v-list-item-title>{{ $t('sidebar.taginfo.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('sidebar.taginfo.subtitle') }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          href="https://wiki.openstreetmap.org/wiki/Simple_Indoor_Tagging"
          rel="noopener"
          target="_blank"
        >
          <template v-slot:prepend>
            <v-icon>{{ mdiPuzzleEditOutline }}</v-icon>
          </template>
          <template v-slot:append>
            <v-icon>{{ mdiOpenInNew }}</v-icon>
          </template>
          <v-list-item-title>{{ $t('sidebar.learn.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('sidebar.learn.subtitle') }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <i18n-t
        v-if="replicationStatus"
        keypath="sidebar.last_update"
        class="pa-3 text-caption"
        tag="div"
      >
        <time
          :datetime="lastUpdateTimestamp"
          :title="lastUpdateTimestamp"
        >{{ lastUpdateTimestampFormatted }}</time>
        <a
          href="https://status.indoorequal.org/"
          target="_blank"
          rel="noopener"
        >{{ $t('sidebar.status') }}</a>
      </i18n-t>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import {
  mdiArrowExpandLeft,
  mdiInformationOutline,
  mdiMap,
  mdiMapMarkerCircle,
  mdiNewspaperVariantOutline,
  mdiOpenInNew,
  mdiPuzzleCheck,
  mdiPuzzleEditOutline,
  mdiTag,
} from '@mdi/js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { tilesUrl } from '../config.json';
import { useNews } from './news';
import logo from 'data-url:../icons/indoorequal.svg';

dayjs.extend(relativeTime);

const COMPONENTS = {
  explore: defineAsyncComponent(() => import('./sidebar/explore')),
  api: defineAsyncComponent(() => import('./sidebar/api')),
  about: defineAsyncComponent(() => import('./sidebar/about')),
  news: defineAsyncComponent(() => import('./sidebar/news')),
  preview: defineAsyncComponent(() => import('./sidebar/preview')),
};

const fetchReplicationStatus = async function() {
  const replicationStatusRequest = await fetch(`${tilesUrl}replicationstatus`);
  return replicationStatusRequest.json();
}

const { hasUnreadNews } = useNews();

const menu = defineModel('menu', { type: [String, null] });

const replicationStatus = ref(null);

const hasSubSidebar = computed(() => {
  return menu.value !== '';
});

const componentName = computed(() => {
  return COMPONENTS[menu.value];
});

const lastUpdateTimestamp = computed(() => {
  return replicationStatus.value.timestamp;
});

const lastUpdateTimestampFormatted = computed(() => {
  return dayjs(lastUpdateTimestamp.value).fromNow();
});

function display(component) {
  updateMenu(component)
  plausible(`Display ${component}`);
};

function hideMenu() {
  updateMenu(null);
}

function updateValue(value) {
  if (!value) {
    updateMenu(null);
  }
}

function updateMenu(value) {
  menu.value = value;
}

watch(
  () => menu.value,
  async (value) => {
    if (value !== null && value !== '' && !Object.keys(COMPONENTS).includes(value)) {
      updateMenu('');
    }
    if (value !== null && !replicationStatus.value) {
      replicationStatus.value = await fetchReplicationStatus();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.logo {
  max-width: 70%;
}
</style>
