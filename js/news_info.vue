<template>
  <sub-sidebar
    :title="$t('sidebar.news.title')"
    @close="$emit('close')"
  >
    <div class="pt-4 px-4">
      <div v-for="info in news">
        <h3>
          <v-chip
            small
            label
            >{{ $d(info.date) }}</v-chip>
          {{ info.title }}
        </h3>
        <p class="mt-1 text-body-2" v-html="info.__content"></p>
      </div>
    </div>
  </sub-sidebar>
</template>

<script>
import news from '../news.js';
import SubSidebar from './sub_sidebar';


export default {
  components: { SubSidebar },

  data() {
    return {
      news,
    };
  }
};
</script>
