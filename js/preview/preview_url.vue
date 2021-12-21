<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title>
        {{ $t('preview.url.title') }}
      </v-card-title>
      <v-card-text>
        <i18n path="preview.url.text" tag="p">
          <strong>{{ domain }}</strong>
        </i18n>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="darken-1"
          text
          @click="dialog = false"
        >
          {{ $t('preview.url.no') }}
        </v-btn>
        <v-btn
          :loading="loading"
          color="green darken-1"
          text
          @click="downloadAndPreview"
        >
          {{ $t('preview.url.yes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      dialog: true,
      loading: false
    };
  },

  computed: {
    domain() {
      return new URL(this.url).hostname;
    }
  },

  methods: {
    downloadAndPreview() {
      this.loading = true;
      fetch(this.url)
        .then(r => r.arrayBuffer())
        .then(b => {
          this.dialog = false;
          const filename = new URL(this.url).pathname.split('/').reverse()[0];
          const file = new File([b], filename);
          this.$emit('openPreview', file);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
