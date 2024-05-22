<template>
  <v-dialog
    :model-value="model"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title>
        {{ t('preview.url.title') }}
      </v-card-title>
      <v-card-text>
        <i18n-t keypath="preview.url.text" tag="p">
          <strong>{{ domain }}</strong>
        </i18n-t>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="darken-1"
          text
          @click="close"
        >
          {{ t('preview.url.no') }}
        </v-btn>
        <v-btn
          :loading="loading"
          color="green darken-1"
          text
          @click="ok"
        >
          {{ t('preview.url.yes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  origin: {
    type: String,
    required: true,
  },
  action: {
    type: Function,
    required: true
  },
});

const model = defineModel({ type: Boolean });

const loading = ref(false);

const domain = computed(() => {
  return new URL(props.origin).hostname;
});

function close() {
  model.value = false;
}

const emit = defineEmits(['openPreview']);

async function ok() {
  loading.value = true;
  try {
    const file = await props.action();
    close();
    emit('openPreview', file);
  } catch(e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>
