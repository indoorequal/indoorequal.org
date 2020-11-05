<template>
  <sub-sidebar
    :title="$t('explore_list.title')"
    @close="$emit('close')"
  >
    <p
      v-html="$t('explore_list.description', { wikipage: `<a href='https://wiki.openstreetmap.org/wiki/Simple_Indoor_Tagging'>${$t('explore_list.wikipage')}</a>` })"
      class="px-4 pt-2"
    />

    <p
      v-if="error"
      class="px-4 pt-2"

    >{{ $t('explore_list.error') }}</p>
    <v-skeleton-loader
      v-else-if="links.length === 0"
      type="card-heading@20"
      class="mx-4"
    />
    <v-card
      v-for="link in links"
      :href="link.link"
      class="my-3 mx-4"
      @click="$emit('toggleMenu')"
    >
      <v-card-title>
        {{ link.description }}
      </v-card-title>
      <v-card-subtitle>
        {{ $t('explore_list.subtitle', { city: link.city, nation: link.nation }) }}
      </v-card-subtitle>
    </v-card>
  </sub-sidebar>
</template>

<script>
import SubSidebar from './sub_sidebar';

export default {
  components: { SubSidebar },

  data() {
    return {
      links: [],
      error: false
    };
  },

  mounted() {
    fetch('https://wiki.openstreetmap.org/w/api.php?action=parse&page=Simple_Indoor_Tagging&prop=text&section=11&format=json&origin=*')
    .then(res => res.json())
    .then(page => this.links = this.parse(page.parse.text['*']))
    .catch(() => this.error = true);
  },

  methods: {
    parse(fragment) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(fragment, 'text/html');
      return Array.from(doc.querySelectorAll('table tr')).map((row, index) => {
        if (index === 0) return;
        return {
          nation: row.querySelector('td:first-child').textContent,
          province: row.querySelector('td:nth-child(2)').textContent,
          city: row.querySelector('td:nth-child(3)').textContent,
          description: row.querySelector('td:nth-child(4)').textContent,
          link: row.querySelector('td:nth-child(5) a').getAttribute('href').replace('https://www.openstreetmap.org/', '')
        };
      }).filter(n => !!n);
    }
  }
}
</script>
