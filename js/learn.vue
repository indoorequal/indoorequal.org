<template>
  <sub-sidebar
    :title="$t('sidebar.learn.title')"
    @close="$emit('close')"
  >
    <div class="px-4 pt-2">
      <p v-if="error">{{ $t('explore_list.error') }}</p>
      <v-skeleton-loader
        v-else-if="!page"
        type="article@4"
        class="mx-4"
      />
      <div v-html="page" />
      <p><a :href="`https://wiki.openstreetmap.org/wiki/${wikiPage}`">Edit this page</a></p>
    </div>
  </sub-sidebar>
</template>

<script>
import SubSidebar from './sub_sidebar';

async function fetchWikiPage(pageName) {
  const data = await fetch(`https://wiki.openstreetmap.org/w/api.php?action=parse&page=${pageName}&prop=text&format=json&origin=*&disabletoc=true&disableeditsection=true`);
  return data.json();
}

export default {
  components: { SubSidebar },

  data() {
    return {
      wikiPage: 'indoor=/How_to_map',
      page: null,
      error: false
    };
  },

  async mounted() {
    try {
      const page = await fetchWikiPage(this.wikiPage);
      this.page = page.parse.text['*'];
    } catch (e) {
      console.log(e);
      this.error = true;
    }
  },
};
</script>
