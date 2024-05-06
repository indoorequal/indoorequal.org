<template>
  <sub-sidebar
    :title="$t('sidebar.news.title')"
    @close="$emit('close')"
  >
    <div class="pt-4 px-4">
      <div
        v-for="info in news"
        class="mb-3"
      >
        <h3>
          <v-chip
            size="small"
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
import news from './news';
import SubSidebar from './sub_sidebar';

export default {
  components: { SubSidebar },

  mixins: [news],

  mounted() {
    this.markAsRead();
  }
};
</script>
