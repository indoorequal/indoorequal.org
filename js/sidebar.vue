<template>
  <v-navigation-drawer
    :value="value"
    width="350"
    temporary
    app
    @input="updateValue"
  >
    <component
      v-if="component"
      :is="componentName"
      class="pa-3"
      @toggleMenu="toggleValue"
      @close="component = false"
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
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                @click="toggleValue"
                v-on="on"
              >
                <v-icon>mdi-arrow-expand-left</v-icon>
              </v-btn>
            </template>
            <span>{{ $t("sidebar.collapse") }}</span>
          </v-tooltip>
        </div>
        <i18n path="sidebar.description" tag="p" class="mt-2 mb-1">
          <a href="https://openstreetmap.org/" target="_blank">{{ $t('sidebar.osm') }}</a>
        />
        </i18n>
      </div>
      <v-list>
        <v-list-item @click="display('explore')">
          <v-list-item-icon>
            <v-icon>mdi-map-marker-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('sidebar.explore.title') }}</v-list-item-title>
            <v-list-item-subtitle>{{ $t('sidebar.explore.subtitle') }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="display('api')">
          <v-list-item-icon>
            <v-icon>mdi-map</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('sidebar.api.title') }}</v-list-item-title>
            <v-list-item-subtitle>{{ $t('sidebar.api.subtitle') }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="display('about')">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('sidebar.about.title') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
    <template v-slot:append>
      <div
        v-if="state"
        class="pa-3 caption"
      >
        {{ $t('sidebar.last_update') }}
        <time
          :datetime="lastUpdateTimestamp"
          :title="lastUpdateTimestamp"
        >{{ lastUpdateTimestampFormatted }}</time>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { DateTime } from 'luxon';
import { tilesUrl } from '../config.json';
import AboutInfo from './about_info';
import ApiInfo from './api_info';
import ExploreList from './explore_list';
import logo from '../icons/indoorequal.svg';

const COMPONENTS = {
  explore: ExploreList,
  api: ApiInfo,
  about: AboutInfo,
};

export default {
  components: {
    AboutInfo,
    ApiInfo,
    ExploreList
  },

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      component: false,
      logo,
      state: null
    };
  },

  computed: {
    componentName() {
      return COMPONENTS[this.component];
    },
    lastUpdateTimestamp() {
      return this.state.match(/timestamp=(.+)/)[1].replace(/\\/g, '');
    },
    lastUpdateTimestampFormatted() {
      return DateTime.fromISO(this.lastUpdateTimestamp).toRelative();
    }
  },

  methods: {
    display(component) {
      this.component = component;
    },

    toggleValue() {
      this.updateValue(!this.value);
    },

    updateValue(value) {
      this.$emit('input', value);
      if (!value) {
        this.component = false;
      }
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (value && !this.state) {
          fetch(`${tilesUrl}state`)
            .then(res => res.text())
            .then(state => this.state = state);
        }
      }
    }
  }
}
</script>

<style scoped>
.logo {
  max-width: 70%;
}
</style>
