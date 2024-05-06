<template>
  <v-card
    dark
    color="primary"
  >
    <v-card-title class="d-flex align-center">
      indoor=
      <v-spacer></v-spacer>
      <v-btn
        flat
        icon
        color="transparent"
        @click="$emit('close')"
      >
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <i18n-t keypath="sidebar.description" tag="span">{{ $t('sidebar.osm') }}</i18n-t>
    </v-card-text>

    <v-card-actions>
      <v-btn
        text
        @click="$emit('explore')"
      >
        {{ $t('discover.explore') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { mdiClose } from '@mdi/js';
</script>
