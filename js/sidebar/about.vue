<template>
  <sub-sidebar
    :title="$t('sidebar.about.title')"
    @close="$emit('close')"
  >
    <v-list lines="two">
      <v-list-item
        href="https://2metz.fr"
        target="_blank"
        rel="noopener"
      >
        <template v-slot:prepend>
          <v-icon>{{ mdiLink }}</v-icon>
        </template>
        <v-list-item-title>{{ $t('sidebar.about.created_by') }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        href="https://github.com/indoorequal"
        target="_blank"
        rel="noopener"
      >
        <template v-slot:prepend>
          <v-icon>{{ mdiGithub }}</v-icon>
        </template>
        <v-list-item-title>GitHub</v-list-item-title>
      </v-list-item>
    </v-list>
  </sub-sidebar>
</template>

<script setup>
import { mdiLink, mdiGithub } from '@mdi/js';
import SubSidebar from './sub_sidebar';
</script>
