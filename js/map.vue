<template>
  <div>
    <MglMap
      :center="mapCenter"
      :zoom="mapZoom"
      :map-style="mapStyle"
      hash="map"
      @load="load"
      @update:center="updateMapCenter"
      @update:zoom="updateMapZoom"
    >
      <MglNavigationControl show-compass />
      <MglVectorLayer
        v-for="layer in layers"
        :key="layer.id"
        :clear-source="false"
        :layer-id="layer.id"
        :layer="layer"
        :source="indoorSource"
        source-id="indoor"
      />
      <level-control
        :value="mapLevel"
        source="indoor"
        layer="area"
        @input="updateMapLevel"
      />
    </MglMap>
    <img
      v-for="(icon, key) in icons"
      v-show="false"
      :ref="key"
      :src="icon"
   />
  </div>
</template>

<script>
import { MglMap, MglNavigationControl, MglVectorLayer } from 'vue-mapbox/dist/vue-mapbox.umd';
import { apiKey, tilesUrl } from '../config.json';
import icons from '../mapicons/*.svg';
import LevelControl from './level_control';

const commonPoi = {
  "type": "symbol",
  "source-layer": "poi",
  "layout": {
    "icon-image": "{class}_11",
    "text-anchor": "top",
    "text-field": "{name:latin}\n{name:nonlatin}",
    "text-font": [
      "Noto Sans Regular"
    ],
    "text-max-width": 9,
    "text-offset": [
      0,
      0.6
    ],
    "text-padding": 2,
    "text-size": 12
  },
  "paint": {
    "text-color": "#666",
    "text-halo-blur": 0.5,
    "text-halo-color": "#ffffff",
    "text-halo-width": 1
  }
};

const rank2Class = ["waste_basket", "information"];

const layers = [
  {
    id: "indoor-polygon",
    type: "fill",
    "source-layer": "area",
    filter: [
      "all",
      [
        "==",
        "$type",
        "Polygon"
      ],
      [
        "!=",
        "class",
        "level"
      ]
    ],
    layout: {
      visibility: "visible"
    },
    paint: {
      "fill-color": "white"
    }
  },
  {
    id: "indoor-area",
    "type": "line",
    "source-layer": "area",
    "filter": [
      "all",
      [
        "in",
        "class",
        "area",
        "corridor",
        "platform"
      ]
    ],
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "line-color": "#bfbfbf",
      "line-width": 1
    }
  },
  {
    id: "indoor-column",
    "type": "fill",
    "source-layer": "area",
    "filter": [
      "all",
      [
        "==",
        "class",
        "column"
      ]
    ],
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "fill-color": "#bfbfbf"
    }
  },
  {
    id: "indoor-lines",
    "type": "line",
    "source-layer": "area",
    "filter": [
      "all",
      [
        "in",
        "class",
        "room",
        "wall"
      ]
    ],
    "layout": {
      "visibility": "visible"
    },
    "paint": {
      "line-color": "gray",
      "line-width": 2
    }
  },
  {
    id: "indoor-transportation",
    "type": "line",
    "source-layer": "transportation",
    "filter": [
      "all"
    ],
    "layout": {
      "visibility": "visible",
    },
    "paint": {
      "line-color": "gray",
      "line-dasharray": [
        0.4,
        0.75
      ],
      "line-width": {
        "base": 1.4,
        "stops": [
          [
            17,
            2
          ],
          [
            20,
            10
          ]
        ]
      }
    }
  },
  {
    id: "indoor-poi-rank1",
    ...commonPoi,
    "filter": [
      "all",
      [
        "==",
        "$type",
        "Point"
      ],
      [
        "!in",
        "class",
        ...rank2Class
      ]
    ]
  },
  {
    id: "indoor-poi-rank2",
    ...commonPoi,
    minzoom: 19,
    "filter": [
      "all",
      [
        "==",
        "$type",
        "Point"
      ],
      [
        "in",
        "class",
        ...rank2Class
      ]
    ]
  },
  {
    id: "indoor-poi-vending",
    ...commonPoi,
    minzoom: 19,
    "filter": [
      "all",
      [
        "==",
        "$type",
        "Point"
      ],
      [
        "==",
        "class",
        "vending_machine"
      ]
    ],
    "layout": {
      ...commonPoi.layout,
      "icon-image": "{subclass}_11"
    }
  },
  {
    id: "indoor-name",
    "type": "symbol",
    "source-layer": "area_name",
    "filter": [
      "all"
    ],
    "layout": {
      "text-field": ["get", "name"],
      "text-font": [
        "Noto Sans Regular"
      ],
      "text-max-width": 5,
      "text-size": 14
    },
    "paint": {
      "text-color": "#666",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1
    }
  }
];

export default {
  components: {
    LevelControl,
    MglMap,
    MglNavigationControl,
    MglVectorLayer
  },

  props: {
    mapBounds: {
      type: Array,
      required: false,
      default() { return []; }
    },

    mapCenter: {
      type: Object,
      required: true
    },

    mapLevel: {
      type: String,
      required: true
    },

    mapZoom: {
      type: Number,
      required: true
    },

    newMapBounds: {
      type: Array,
      required: false,
      default() { return []; }
    },
  },

  data() {
    return {
      icons,
      indoorSource: { url: tilesUrl },
      mapStyle: `https://api.maptiler.com/maps/bright/style.json?key=${apiKey}`
    };
  },

  computed: {
    layers() {
      return layers.map((layer) => {
        const newLayer = { ...layer, filter: [...layer.filter] };
        newLayer.filter.push([
          "==",
          "level",
          this.mapLevel
        ]);
        return newLayer;
      });
    }
  },

  watch: {
    newMapBounds(bbox) {
      this.map.fitBounds(bbox, { duration: 0 });
    }
  },

  methods: {
    load({ map }) {
      this.map = map;
      this.registerIcons();
      setTimeout(() => {
        this.updateMapZoom(map.getZoom());
      }, 100);
    },

    registerIcons() {
      for (let icon in this.icons) {
        if (this.map.hasImage(icon)) {
          this.map.updateImage(icon, this.$refs[icon][0]);
        } else {
          this.map.addImage(icon, this.$refs[icon][0]);
        }
      }
    },

    updateMapCenter(mapCenter) {
      this.$emit('update:mapCenter', mapCenter);
      this.updateMapBounds();
    },

    updateMapBounds() {
      const bounds = this.map.getBounds();
      this.$emit('update:mapBounds', [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]);
    },

    updateMapLevel(mapLevel) {
      this.$emit('update:mapLevel', mapLevel);
    },

    updateMapZoom(mapZoom) {
      this.$emit('update:mapZoom', mapZoom);
      this.updateMapBounds();
    }
  }
};
</script>

<style>
.mgl-map-wrapper {
  height: 100vh;
  position: relative;
  width: 100vw;
}

.mgl-map-wrapper .mapboxgl-map {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
