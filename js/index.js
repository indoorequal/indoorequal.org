import 'maplibre-gl/dist/maplibre-gl.css';
import '@mdi/font/css/materialdesignicons.css';

import Vue from 'vue';
import Vuetify, {
  VApp,
  VAutocomplete,
  VBtn,
  VCard,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VChip,
  VDialog,
  VDivider,
  VExpandTransition,
  VFileInput,
  VIcon,
  VImg,
  VList,
  VListGroup,
  VListItem,
  VListItemContent,
  VListItemIcon,
  VListItemSubtitle,
  VListItemTitle,
  VMain,
  VMenu,
  VNavigationDrawer,
  VSkeletonLoader,
  VSpacer,
  VSubheader,
  VToolbar,
  VToolbarTitle,
  VTooltip
} from 'vuetify/lib';
import VueI18n from 'vue-i18n';
import messages from '../locales/*.json';
import App from './app.vue';

Vue.use(Vuetify, {
  components: {
    VApp,
    VAutocomplete,
    VBtn,
    VCard,
    VCardActions,
    VCardSubtitle,
    VCardText,
    VCardTitle,
    VChip,
    VDialog,
    VDivider,
    VExpandTransition,
    VFileInput,
    VIcon,
    VImg,
    VList,
    VListGroup,
    VListItem,
    VListItemContent,
    VListItemIcon,
    VListItemSubtitle,
    VListItemTitle,
    VMain,
    VMenu,
    VNavigationDrawer,
    VSkeletonLoader,
    VSpacer,
    VSubheader,
    VToolbar,
    VToolbarTitle,
    VTooltip
  }
});
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: navigator.language.split('-')[0],
  fallbackLocale: 'en',
  availableLocales: Object.keys(messages),
  messages
});

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#6667ad',
      },
    },
  },
});

new Vue({
  i18n,
  vuetify,
  render: createEle => createEle(App),
}).$mount('#app');
