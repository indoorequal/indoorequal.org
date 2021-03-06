<template>
  <v-card
    :loading="loading"
    :style="{ 'min-height': loading ? '10px' : 0 }"
  >
    <v-expand-transition>
      <div v-if="geojson">
        <v-card-title class="subtitle-1 flex-grow-1">
          <img
            v-if="icon"
            :src="iconURL"
            class="flex-grow-0 pr-1"
          >
          {{ tags.name || type }}
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle v-if="tags.name">{{ type }}</v-card-subtitle>
        <v-img
          v-if="tags.mapillary"
          :src="`https://images.mapillary.com/${tags.mapillary}/thumb-320.jpg`"
        >
        </v-img>
        <v-list
          v-if="displayList"
          dense
        >
          <opening-hours
            v-if="tags.opening_hours"
            :value="tags.opening_hours"
            namespace="opening_hours"
          />
          <v-list-item
            v-if="tags['opening_hours:url']"
            :href="tags['opening_hours:url']"
            target="_blank"
            rel="noopener"
          >
            <v-list-item-icon>
              <v-icon dense>mdi-clock-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('opening_hours.url') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="contact in contacts"
            :href="contact.href"
            :target="contact.href.startsWith('http') ? '_blank' : ''"
            rel="noopener"
          >
            <v-list-item-icon>
              <v-icon dense>mdi-{{ contact.type }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ contact.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="tags.wheelchair && $te(`wheelchair.${tags.wheelchair}`)">
            <v-list-item-icon>
              <v-icon dense>mdi-wheelchair-accessibility</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(`wheelchair.${tags.wheelchair}`) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { tilesUrl, indoorEqualApiKey } from '../config.json';
import { contactsFor } from './place';
import OpeningHours from './opening_hours';

function dataToCanvas(data, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  const imageData = context.createImageData(width, height);
  imageData.data.set(data);
  context.putImageData(imageData, 0, 0);
  return context.canvas;
}

export default {
  components: {
    OpeningHours
  },

  props: {
    value: {
      type: String,
      required: true
    },
    sprite: {
      type: Object,
      required: false
    }
  },

  data() {
    return {
      loading: false,
      geojson: null
    }
  },

  computed: {
    tags() {
      return this.geojson.properties.tags;
    },

    icon() {
      if (this.sprite) {
        const klass = this.geojson.properties.class;
        const subclass = this.geojson.properties.subclass;
        const icon = [subclass, klass].find(value => this.sprite[`indoorequal-${value}`]);
        if (icon) {
          return this.sprite[`indoorequal-${icon}`].data;
        }
      }
    },

    iconURL() {
      if (this.icon) {
        return dataToCanvas(this.icon.data, this.icon.width, this.icon.height).toDataURL();
      }
    },

    type() {
      const mappingTags = ['aerialway', 'amenity', 'barrier', 'craft', 'door',
                           'exhibit', 'emergency', 'entrance', 'highway', 'landuse', 'leisure',
                           'office', 'railway', 'shop', 'sport', 'tourism'];
      const mapping = mappingTags.find((t) => this.tags[t]);
      return this.$i18n.t(`poi.${mapping}.${this.tags[mapping]}`);
    },

    displayList() {
      return this.contacts.length > 0
        || this.tags.opening_hours
        || this.tags['opening_hours:url']
        || this.$te(`wheelchair.${this.tags.wheelchair}`);
    },

    contacts() {
      const contacts = contactsFor(this.tags);
      return ['phone', 'website', 'facebook'].map(name => contacts(name)).flat().filter(c => !!c);
    }
  },

  methods: {
    close() {
      this.geojson = null;
      this.$emit('input', '');
    }
  },

  watch: {
    value: {
      immediate: true,
      handler() {
        this.geojson = null;
        if (this.value === '') {
          return;
        }
        this.loading = true;
        fetch(`${tilesUrl}poi/${this.value}?key=${indoorEqualApiKey}`)
          .then(res => res.json())
          .then((geojson) => {
            this.geojson = geojson;
            this.$emit('poiCoordinates', geojson.geometry.coordinates);
          })
          .finally(() => this.loading = false);
      }
    }
  }
}
</script>
