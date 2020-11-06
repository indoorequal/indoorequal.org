import 'mapbox-gl/dist/mapbox-gl.css';
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
  VContent,
  VDialog,
  VDivider,
  VExpandTransition,
  VIcon,
  VImg,
  VList,
  VListGroup,
  VListItem,
  VListItemContent,
  VListItemIcon,
  VListItemSubtitle,
  VListItemTitle,
  VMenu,
  VNavigationDrawer,
  VSkeletonLoader,
  VSpacer,
  VSubheader,
  VTooltip,
  VToolbar,
  VToolbarTitle
} from 'vuetify/lib';
import VueI18n from 'vue-i18n';
import messages from '../locales/*.json';
import App from './app';

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
    VContent,
    VDialog,
    VDivider,
    VExpandTransition,
    VIcon,
    VImg,
    VList,
    VListGroup,
    VListItem,
    VListItemContent,
    VListItemIcon,
    VListItemSubtitle,
    VListItemTitle,
    VMenu,
    VNavigationDrawer,
    VSkeletonLoader,
    VSpacer,
    VSubheader,
    VTooltip,
    VToolbar,
    VToolbarTitle
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
