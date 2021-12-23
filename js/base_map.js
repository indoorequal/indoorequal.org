import { mapStyle } from './maptiler';

export default {
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

  provide() {
    const self = this;
    return {
      get indoorequal() {
        return self.indoorEqualInstance;
      }
    };
  },

  data() {
    return {
      mapStyle: mapStyle()
    };
  },

  watch: {
    newMapBounds(bbox) {
      this.map.fitBounds(bbox, { duration: 0 });
    }
  },

  methods: {
    mouseenterLayer(e) {
      e.map.getCanvas().style.cursor = 'pointer';
    },

    clickLayer(e) {
      const id = e.mapboxEvent.features[0].properties.id;
      this.$emit('clickPoi', id);
    },

    mouseleaveLayer(e) {
      e.map.getCanvas().style.cursor = '';
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
