<template>
  <sub-sidebar
    :title="$t('explore_list.title')"
    @close="$emit('close')"
  >
    <div class="mx-4">
      <p
        v-html="$t('explore_list.description', { wikipage: `<a href='https://wiki.openstreetmap.org/wiki/Simple_Indoor_Tagging'>${$t('explore_list.wikipage')}</a>` })"
        class="pt-4 pb-3"
      />
  
      <p
        v-if="error"
        class="pt-2"
      >{{ $t('explore_list.error') }}</p>
      <v-skeleton-loader
        v-else-if="links.length === 0"
        type="card@20"
      />
      <template v-for="(links, country) in byCountry">
        {{ country }}
        <v-card
          v-for="link in links"
          :href="link.link"
          class="my-3"
          @click="$emit('hideMenu')"
        >
          <v-card-title class="subtitle-1">
            {{ link.description }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t('explore_list.subtitle', { city: link.city, nation: link.nation }) }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn
              text
              color="primary"
            >
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </div>
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
    fetch('https://wiki.openstreetmap.org/w/api.php?action=parse&page=Simple_Indoor_Tagging&prop=text&section=12&format=json&origin=*')
    .then(res => res.json())
    .then(page => this.links = this.parse(page.parse.text['*']))
    .catch(() => this.error = true);
  },

  computed: {
    byCountry() {
      return this.links.reduce((memo, link) => {
        if (!memo[link.nation]) {
          memo[link.nation] = [];
        }
        memo[link.nation].push(link);
        return memo;
      }, {});
    },
  },

  methods: {
    parse(fragment) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(fragment, 'text/html');
      const result = Array.from(doc.querySelectorAll('table tr')).map((row, index) => {
        if (index === 0) return;
        const location = row.querySelector('td:first-child');
        const nation = location.querySelector('span').textContent;
        location.removeChild(location.querySelector('span'));
        const city = location.textContent;
        return {
          nation,
          city,
          description: row.querySelector('td:nth-child(2)').textContent,
          link: row.querySelector('td:nth-child(5) a').getAttribute('href').replace('https://indoorequal.org', '')
        };
      }).filter(n => !!n);
      if (result.length === 0) {
        throw new Error('Could not find any links.');
      }
      return result;
    }
  }
}
</script>
