<script>
import { $helpers } from 'vue-mapbox/dist/vue-mapbox.umd.js';
import IndoorEqual from 'mapbox-gl-indoorequal';
import 'mapbox-gl-indoorequal/mapbox-gl-indoorequal.css';

export default {
  mixins: [$helpers.asControl],

  props: {
    value: {
      type: String,
      required: true
    },
  },

  mounted() {
    this.control = new IndoorEqual(this.map);
    this.$_addControl();
    this.control.updateLevel(this.value);
    this.control.on('levelchange', (level) => this.$emit('input', level));
  }
};
</script>
