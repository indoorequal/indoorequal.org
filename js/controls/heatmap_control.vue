<template>
  <mgl-custom-control position="top-right">
    <button
      :title="title"
      class="maplibregl-ctrl-heatmap"
      type="button"
      @click="toggleHeatmap"
    >
      <span class="maplibregl-ctrl-icon">
        <v-icon :color="iconColor" size="24px">{{ mdiBlur }}</v-icon>
      </span>
    </button>
  </mgl-custom-control>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue';
import { MglCustomControl } from '@indoorequal/vue-maplibre-gl';
import { useI18n } from 'vue-i18n';
import { mdiBlur } from '@mdi/js';

const { t } = useI18n();

const displayHeatmap = ref(true);

const iconColor = computed(() => {
  return displayHeatmap.value ? 'primary' : '';
});

const title = computed(() => {
  return displayHeatmap.value ? t('heatmap.hide') : t('heatmap.show');
});

function toggleHeatmap() {
  displayHeatmap.value = !displayHeatmap.value;
}

const indoorequal = inject('indoorequal');
watch(displayHeatmap, () => {
  indoorequal.value.setHeatmapVisible(displayHeatmap.value);
});
</script>
