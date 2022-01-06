<template>
  <v-app>
    <v-main>
      <v-text-field
        label="BBox"
        placeholder="1.971874,48.921259,2.299404,49.029990"
        @change="sendBbox"
      ></v-text-field>
      <div class="d-flex">
        <v-text-field
          v-model="center"
          label="Center"
          placeholder="2.134953,48.9638220"
        ></v-text-field>
        <v-text-field
          v-model="zoom"
          label="Zoom"
          placeholder="2"
        ></v-text-field>
        <v-btn @click="sendCenterAndZoom">Send</v-btn>
      </div>
      <v-text-field
        label="BBox"
        placeholder="1.971874,48.921259,2.299404,49.029990"
        @change="sendBbox"
      ></v-text-field>
      <v-text-field
        label="Level"
        @change="sendLevel"
      ></v-text-field>
      <v-text-field
        label="Preview URL"
        @change="sendPreviewURL"
      ></v-text-field>
      <v-file-input
        accept=".osm,.geojson,.zip"
        label="File input for preview"
        @change="sendPreviewFile"
      ></v-file-input>
      <iframe ref="iframe" src="/" width="100%" frameborder="0"></iframe>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      center: '',
      zoom: 0,
    };
  },

  methods: {
    sendPreviewFile(file) {
      if (!file) return;
      this.sendMessage({ command: 'preview', file });
    },

    sendPreviewURL(url) {
      this.sendMessage({ command: 'preview', url });
    },

    sendLevel(level) {
      this.sendMessage({ command: 'level', level });
    },

    sendBbox(bbox) {
      this.sendMessage({ command: 'coordinates', bbox: bbox.split(',') });
    },

    sendCenterAndZoom() {
      const center = this.center.split(',').map(parseFloat);
      this.sendMessage({ command: 'coordinates', center: { lng: center[0], lat: center[1]}, zoom: parseInt(this.zoom, 10) });
    },

    sendMessage(message) {
      this.$refs.iframe.contentWindow.postMessage(message, '*');
    }
  }
}
</script>

<style scoped>
iframe {
  min-height: 400px;
}
</style>
