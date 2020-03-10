import 'mapbox-gl/dist/mapbox-gl.css';
import '@mdi/font/css/materialdesignicons.css';

import Vue from 'vue';
import Vuetify, {
  VApp,
  VAutocomplete,
  VBtn,
  VCard,
  VCardSubtitle,
  VCardTitle,
  VContent,
  VDivider,
  VIcon,
  VList,
  VListItem,
  VListItemContent,
  VListItemIcon,
  VListItemSubtitle,
  VListItemTitle,
  VMenu,
  VNavigationDrawer,
  VSkeletonLoader,
  VTooltip
} from 'vuetify/lib';
import VueI18n from 'vue-i18n';
import messages from '../locales/en.json';
import App from './app';

Vue.use(Vuetify, {
  components: {
    VApp,
    VAutocomplete,
    VBtn,
    VCard,
    VCardSubtitle,
    VCardTitle,
    VContent,
    VDivider,
    VIcon,
    VList,
    VListItem,
    VListItemContent,
    VListItemIcon,
    VListItemSubtitle,
    VListItemTitle,
    VMenu,
    VNavigationDrawer,
    VSkeletonLoader,
    VTooltip
  }
});
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  messages
});

const vuetify = new Vuetify({});

new Vue({
  i18n,
  vuetify,
  render: createEle => createEle(App),
}).$mount('#app');
