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
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle v-if="tags.name">{{ type }}</v-card-subtitle>
        <iframe
          v-if="tags.mapillary"
          :src="`https://www.mapillary.com/embed?image_key=${tags.mapillary}&style=photo`"
          width="100%"
          frameborder="0"
        ></iframe>
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
              <v-icon dense>{{ mdiClockOutline }}</v-icon>
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
              <v-icon dense>{{ contactIcons[contact.type] }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ contact.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="tags.wheelchair && $te(`wheelchair.${tags.wheelchair}`)">
            <v-list-item-icon>
              <v-icon dense>{{ mdiWheelchairAccessibility }}</v-icon>
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
import { mdiClose, mdiClockOutline, mdiWheelchairAccessibility, mdiPhone, mdiLink, mdiFacebook } from '@mdi/js';
import { contactsFor } from './place';

const OpeningHours = () => import('./opening_hours');

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

const contactIcons = {
  facebook: mdiFacebook,
  link: mdiLink,
  phone: mdiPhone
};

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
    },
    poiFetcher: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      contactIcons,
      geojson: null,
      loading: false,
      mdiClockOutline,
      mdiClose,
      mdiWheelchairAccessibility,
    };
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
      async handler() {
        this.geojson = null;
        if (this.value === '') {
          return;
        }
        this.loading = true;
        try {
          this.geojson = await this.poiFetcher(this.value);
          this.$emit('poiCoordinates', this.geojson.geometry.coordinates);
        } finally {
          this.loading = false;
        }
      }
    }
  }
}
</script>
