<template>
  <v-dialog
    :value="value"
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
          @click="close"
        >
          {{ $t('preview.url.no') }}
        </v-btn>
        <v-btn
          :loading="loading"
          color="green darken-1"
          text
          @click="ok"
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
    origin: {
      type: String,
      required: true,
    },
    action: {
      type: Function,
      required: true
    },
    value: {
      type: Boolean,
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
      return new URL(this.origin).hostname;
    }
  },

  methods: {
    close() {
      this.$emit('input', false);
    },

    async ok() {
      this.loading = true;
      try {
        const file = await this.action();
        this.close();
        this.$emit('openPreview', file);
      } catch(e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
