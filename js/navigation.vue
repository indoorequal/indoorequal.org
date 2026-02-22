<template>
  <v-card>
    <v-card-item>
      <v-card-title class="d-flex align-center">
        Navigate
        <v-spacer></v-spacer>
        <v-btn
          flat
          icon
          color="transparent"
          @click="close"
        >
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <v-text-field v-model="start" label="Start point"></v-text-field>
      <v-text-field v-model="end" label="Destination"></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-btn
        :loading="loading"
        :disabled="start == '' || end == ''"
        @click="search"
     >Find directions</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { mdiClose } from '@mdi/js';

const show = defineModel({ type: [Boolean] });
const start = defineModel('start', { type: [Array, String] });
const end = defineModel('end', { type: [Array, String] });
const line = defineModel('line', { type: Object });
const loading = ref(false);

watch(
  () => [start.value, end.value],
  async () => {
    show.value = start.value != '' || end.value != '';
    line.value = null;
  },
);

function close() {
  line.value = null;
  start.value = '';
  end.value = '';
}

async function search() {
  loading.value = true;
  try {
    const json = {
      locations: [
           {lat: start.value[0].lat, lon: start.value[0].lng, search_filter: { level: start.value[1] } },
           {lat: end.value[0].lat, lon: end.value[0].lng, search_filter: { level: end.value[1] } }
      ],
      costing: 'pedestrian'
    };
    const res = await (await fetch(`https://valhalla1.openstreetmap.de/route?json=${JSON.stringify(json)}`)).json();
    loading.value = false;
    console.log(res);
    line.value = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: decodeLine(res.trip.legs[0].shape).map(t => t.reverse())
          }
        }
      ]
    };
  } catch (e) {
    loading.value = false;
  }
}

// This is adapted from the implementation in Project-OSRM
// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
function decodeLine(str, precision) {
    let index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
}
</script>
