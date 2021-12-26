<template>
  <sub-sidebar
    :title="$t('sidebar.about.title')"
    @close="$emit('close')"
  >
    <v-list>
      <v-list-item
        href="https://2metz.fr"
        target="_blank"
        rel="noopener"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiLink }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('sidebar.about.created_by') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        href="https://twitter.com/francois2metz"
        target="_blank"
        rel="noopener"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiTwitter }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>@francois2metz</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        href="https://github.com/indoorequal"
        target="_blank"
        rel="noopener"
      >
        <v-list-item-icon>
          <v-icon>{{ mdiGithub }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>GitHub</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </sub-sidebar>
</template>

<script>
import { mdiLink, mdiTwitter, mdiGithub } from '@mdi/js';
import SubSidebar from './sub_sidebar';

export default {
  components: { SubSidebar },

  data() {
    return { mdiLink, mdiTwitter, mdiGithub };
  }
};
</script>
