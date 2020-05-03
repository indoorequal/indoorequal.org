<template>
  <v-dialog
    v-model="dialog"
    :width="500"
  >
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on">
        <v-list-item-icon>
          <v-icon>mdi-information-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('sidebar.about.title') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-card>
      <v-card-title>
        {{ $t('sidebar.about.title') }}
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-list>
        <v-list-item
          href="https://2metz.fr"
          target="_blank"
          rel="noopener"
        >
          <v-list-item-icon>
            <v-icon>mdi-link</v-icon>
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
            <v-icon>mdi-twitter</v-icon>
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
            <v-icon>mdi-github</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>GitHub</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    };
  }
}
</script>
