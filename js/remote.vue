<template>
  <v-app>
    <v-main>
      <v-text-field
        label="Level"
        @change="sendLevel"
      ></v-text-field>
      <v-file-input
        accept=".osm,.geojson,.zip"
        label="File input for preview"
        @change="sendPreview"
      ></v-file-input>
      <iframe ref="iframe" src="/" width="100%" frameborder="0"></iframe>
    </v-main>
  </v-app>
</template>

<script>
export default {
  methods: {
    sendPreview(file) {
      if (!file) return;
      this.sendMessage({ command: 'preview', file  });
    },

    sendLevel(level) {
      this.sendMessage({ command: 'level', level });
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
