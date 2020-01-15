<template>
  <div>
    <v-skeleton-loader
      v-if="links.length === 0"
      type="card-heading@20"
    />
    <v-card
      v-for="link in links"
      :href="link.link"
      class="my-3"
      @click="$emit('click')"
    >
      <v-card-title>
        {{ link.description }}
      </v-card-title>
      <v-card-subtitle>
        {{ link.city }}
        -
        {{ link.nation }}
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: []
    };
  },

  mounted() {
    fetch('https://wiki.openstreetmap.org/w/api.php?action=parse&page=Simple_Indoor_Tagging&prop=text&section=12&format=json&origin=*')
    .then(res => res.json())
    .then(page => this.links = this.parse(page.parse.text['*']));
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
