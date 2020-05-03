<template>
  <v-navigation-drawer
    :value="value"
    width="300"
    temporary
    app
    @input="updateValue"
  >
    <explore-list
      v-if="explore"
      class="pa-3"
      @toggleMenu="toggleValue"
      @toggleExplore="toggleExplore"
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
        <p
          v-html="$t('sidebar.description', { osm: `<a href='https://openstreetmap.org/'>${$t('sidebar.osm')}</a>` })"
          class="mt-2 mb-1"
        />
      </div>
      <v-list>
        <v-list-item @click="toggleExplore">
          <v-list-item-icon>
            <v-icon>mdi-map-marker-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('sidebar.explore.title') }}</v-list-item-title>
            <v-list-item-subtitle>{{ $t('sidebar.explore.subtitle') }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <about-dialog />
      </v-list>
    </template>
    <template v-slot:append>
      <div
        v-if="state"
        class="pa-3 font-italic caption"
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
import AboutDialog from './about_dialog';
import ExploreList from './explore_list';
import logo from '../icons/indoorequal.svg';

export default {
  components: {
    AboutDialog,
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
      explore: false,
      logo,
      state: null
    };
  },

  computed: {
    lastUpdateTimestamp() {
      return this.state.match(/timestamp=(.+)/)[1].replace(/\\/g, '');
    },
    lastUpdateTimestampFormatted() {
      return DateTime.fromISO(this.lastUpdateTimestamp).toRelative();
    }
  },

  methods: {
    toggleExplore() {
      this.explore = !this.explore;
    },

    toggleValue() {
      this.updateValue(!this.value);
    },

    updateValue(value) {
      this.$emit('input', value);
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
