<template>
  <mgl-custom-control
    class="maplibregl-ctrl level-ctrl"
    position="bottom-right"
  >
    <v-btn
      v-for="level in displayedLevels"
      :color="level == value ? 'primary' : 'white'"
      class="button d-block mb-2"
      @click="setLevel(level)"
    >
      {{ level }}
    </v-btn>
  </mgl-custom-control>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue';
import { MglCustomControl } from '@indoorequal/vue-maplibre-gl';

const indoorequal = inject('indoorequal');

const emit = defineEmits(['input', 'levels']);
const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

const displayedLevels = ref([]);

function sortLevels(a, b) {
  if (isNaN(parseInt(a, 10))) {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  } else {
    return a - b;
  }
}
onMounted(() => {
  const updateLevels = (levels) => {
    displayedLevels.value = levels.sort(sortLevels).reverse();
    if (displayedLevels.value.length > 0 && !displayedLevels.value.includes(indoorequal.value.level)) {
      if (displayedLevels.value.includes('0')) {
        setLevel('0');
      } else {
        setLevel(displayedLevels.value[displayedLevels.value.length - 1]);
      }
    }
    emit('levels', levels);
  }
  updateLevels(indoorequal.value.levels);
  indoorequal.value.setLevel(props.value);
  indoorequal.value.on('levelchange', (level) => emit('input', level));
  indoorequal.value.on('levelschange', (levels) => updateLevels(levels));
});

function setLevel(level) {
  indoorequal.value.setLevel(level);
}

watch(
  () => props.value,
  (newLevel) => {
    if (newLevel !== indoorequal.value.level) {
      setLevel(newLevel);
    }
  }
);
</script>


<style>
.level-ctrl {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
<style scoped>
.button {
  margin: 0 auto;
}
</style>
