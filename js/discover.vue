<template>
  <v-card
    dark
    color="#6667ad"
  >
    <v-card-title>
      indoor=
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>


    <v-card-subtitle>
      <i18n path="sidebar.description" tag="span">{{ $t('sidebar.osm') }}</i18n>
    </v-card-subtitle>

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

<script>
export default {};
</script>
