<template>
  <v-app>
    <v-main>
      <v-row
        no-gutters
        class="fill-height overflow-hidden"
      >
        <v-col
          cols="4"
          class="pa-3 sidebar overflow-auto"
        >
          <h1 class="text-h5 mb-2">Test Remote API</h1>
          <v-expansion-panels accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>Set bbox</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>Use <a href="http://bboxfinder.com/" target="_blank">bboxfinder.com</a></p>
                <v-text-field
                  label="bbox"
                  placeholder="1.971874,48.921259,2.299404,49.029990"
                  @change="sendBbox"
                ></v-text-field>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Set center and zoom</v-expansion-panel-header>
              <v-expansion-panel-content>
                <p>Use <a href="http://bboxfinder.com/" target="_blank">bboxfinder.com</a></p>
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
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Set level</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-text-field
                  label="Level"
                  @change="sendLevel"
                ></v-text-field>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Open preview with URL</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-text-field
                  label="Preview URL"
                  @change="sendPreviewURL"
                ></v-text-field>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Open preview with file</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-file-input
                  accept=".osm,.geojson,.zip"
                  label="File input for preview"
                  @change="sendPreviewFile"
                ></v-file-input>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div v-if="messages.length > 0">
            <h2 class="text-h6 my-2">Messages</h2>
            <div
              v-for="message in messages"
              class="text-body-2"
            >{{ message }}</div>
          </div>
        </v-col>
        <v-col>
          <iframe
            ref="iframe"
            src="/"
            width="100%"
            frameborder="0"
            class="fill-height"
          ></iframe>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      center: '',
      zoom: 0,
      messages: [],
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
      this.messages.push(message);
      this.$refs.iframe.contentWindow.postMessage(message, '*');
    }
  }
}
</script>

<style scoped>
iframe {
  min-height: 400px;
}
.sidebar {
  height: 100vh;
}
</style>
