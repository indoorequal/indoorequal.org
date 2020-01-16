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
          <h1 class="display-1">indoor=</h1>
          <v-btn
            icon
            @click="toggleValue"
          >
            <v-icon>mdi-arrow-expand-left</v-icon>
          </v-btn>
        </div>
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
            <img src="../icons/github.svg" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>GitHub</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import ExploreList from './explore_list';

export default {
  components: {
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
      explore: false
    };
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
  }
}
</script>
