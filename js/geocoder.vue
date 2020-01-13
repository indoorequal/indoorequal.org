<template>
  <input
    ref="input"
    autocomplete="off"
    type="text"
  />
</template>

<script>
import { apiKey } from '../config.json';

export default {
  mounted () {
    const geocoder = new maptiler.Geocoder({
      input: this.$refs.input,
      key: apiKey
    });
    geocoder.on('select', (item) => {
      this.$emit('select', item.bbox);
    });
  }
}
</script>

<style scoped>
input {
  position: absolute;
  top: 10px;
  left: 150px;
}
</style>
