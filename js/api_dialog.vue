<template>
  <v-dialog
    v-model="dialog"
    :width="500"
    :eager="true"
  >
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on">
        <v-list-item-icon>
          <v-icon>mdi-map</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('sidebar.api.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('sidebar.api.subtitle') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-card>
      <v-card-title>
        {{ $t('sidebar.api.subtitle') }}
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <i18n path="sidebar.api.content" tag="p" class="text-pre">
          <a href="https://tiles.indoorequal.org" target="_blank">tiles.indoorequal.org</a>
          <a href="https://github.com/indoorequal/mapbox-gl-indoorequal" target="_blank">{{ $t('sidebar.api.plugin') }}</a>
        </i18n>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    };
  }
}
</script>

<style scoped>
.text-pre {
  white-space: pre-line;
}
</style>
