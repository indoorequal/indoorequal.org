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
          <p>The Remote API allows you to embed and interact with the viewer.</p>
          <p>Read the <a href="https://github.com/indoorequal/indoorequal.org#remote-command-api" target="_blank">remote API documentation</a>.</p>
          <v-expansion-panels accordion>
            <v-expansion-panel>
              <v-expansion-panel-title>Set bbox</v-expansion-panel-title>
              <v-expansion-panel-text>
                <p>Use <a href="http://bboxfinder.com/" target="_blank">bboxfinder.com</a></p>
                <v-text-field
                  label="bbox"
                  placeholder="1.971874,48.921259,2.299404,49.029990"
                  @update:modelValue="sendBbox"
                ></v-text-field>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Set center and zoom</v-expansion-panel-title>
              <v-expansion-panel-text>
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
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Set level</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-text-field
                  label="Level"
                  @update:modelValue="sendLevel"
                ></v-text-field>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Get levels</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-btn @click="getLevels">Get levels</v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Open preview with URL</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-text-field
                  label="Preview URL"
                  @update:modelValue="sendPreviewURL"
                ></v-text-field>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Open preview with file</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-file-input
                  accept=".osm,.geojson,.zip"
                  label="File input for preview"
                  @update:modelValue="sendPreviewFile"
                ></v-file-input>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <div v-if="messages.length > 0">
            <h2 class="text-h6 my-2">Messages</h2>
            <div
              v-for="message in messages"
              class="text-body-2"
            >{{ message.dir === 'in' ? '<' : '>' }} {{ message.data }}</div>
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

<script setup>
import { ref, onMounted } from 'vue';

const center = ref('');
const zoom = ref(0);
const messages = ref([]);
const iframe = ref(null);

onMounted(() => {
  registerMessageListener();
});

function sendPreviewFile(file) {
  if (!file) return;
  sendMessage({ command: 'preview', file });
}

function sendPreviewURL(url) {
  sendMessage({ command: 'preview', url });
}

function sendLevel(level) {
  sendMessage({ command: 'level', level });
}

function getLevels(level) {
  sendMessage({ command: 'levels' });
}

function sendBbox(bbox) {
  sendMessage({ command: 'coordinates', bbox: bbox.split(',') });
}

function sendCenterAndZoom() {
  const [lng, lat] = center.value.split(',').map(parseFloat);
  sendMessage({ command: 'coordinates', center: { lng, lat}, zoom: parseInt(zoom.value, 10) });
}

function sendMessage(message) {
  messages.value.push({
    dir: 'out',
    data: message
  });
  iframe.value.contentWindow.postMessage(message, '*');
};

function registerMessageListener() {
  window.addEventListener('message', (e) => {
    messages.value.push({
      dir: 'in',
      data: e.data
    });
  });
}
</script>

<style scoped>
iframe {
  min-height: 400px;
}
.sidebar {
  height: 100vh;
}
p {
  margin-bottom: 16px;
}
</style>
