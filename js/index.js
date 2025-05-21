import 'maplibre-gl/dist/maplibre-gl.css';
import 'vuetify/lib/styles/main.sass';

import { createApp } from 'vue';
import { createVuetify } from 'vuetify';

import { VApp } from 'vuetify/lib/components/VApp/VApp.js';
import { VAutocomplete } from 'vuetify/lib/components/VAutocomplete/VAutocomplete.js';
import { VBadge } from 'vuetify/lib/components/VBadge/VBadge.js';
import { VBtn } from 'vuetify/lib/components/VBtn/VBtn.js';
import { VCard } from 'vuetify/lib/components/VCard/VCard.js';
import { VCardActions } from 'vuetify/lib/components/VCard/VCardActions.js';
import { VCardItem } from 'vuetify/lib/components/VCard/VCardItem.js';
import { VCardSubtitle } from 'vuetify/lib/components/VCard/VCardSubtitle.js';
import { VCardText } from 'vuetify/lib/components/VCard/VCardText.js';
import { VCardTitle } from 'vuetify/lib/components/VCard/VCardTitle.js';
import { VChip } from 'vuetify/lib/components/VChip/VChip.js';
import { VDialog } from 'vuetify/lib/components/VDialog/VDialog.js';
import { VDivider } from 'vuetify/lib/components/VDivider/VDivider.js';
import { VExpandTransition } from 'vuetify/lib/components/transitions/index.js';
import { VFileInput } from 'vuetify/lib/components/VFileInput/index.js';
import { VIcon } from 'vuetify/lib/components/VIcon/VIcon.js';
import { VList } from 'vuetify/lib/components/VList/VList.js';
import { VListGroup } from 'vuetify/lib/components/VList/VListGroup.js';
import { VListItem } from 'vuetify/lib/components/VList/VListItem.js';
import { VListItemSubtitle } from 'vuetify/lib/components/VList/VListItemSubtitle.js';
import { VListItemTitle } from 'vuetify/lib/components/VList/VListItemTitle.js';
import { VListSubheader } from 'vuetify/lib/components/VList/VListSubheader.js';
import { VMain } from 'vuetify/lib/components/VMain/VMain.js';
import { VMenu } from 'vuetify/lib/components/VMenu/VMenu.js';
import { VNavigationDrawer } from 'vuetify/lib/components/VNavigationDrawer/VNavigationDrawer.js';
import { VSkeletonLoader } from 'vuetify/lib/components/VSkeletonLoader/VSkeletonLoader.js';
import { VSnackbar } from 'vuetify/lib/components/VSnackbar/VSnackbar.js';
import { VSpacer } from 'vuetify/lib/components/VGrid/VSpacer.js';
import { VToolbar } from 'vuetify/lib/components/VToolbar/VToolbar.js';
import { VToolbarTitle } from 'vuetify/lib/components/VToolbar/VToolbarTitle.js';
import { VTooltip } from 'vuetify/lib/components/VTooltip/VTooltip.js';

import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg';

import { createI18n } from 'vue-i18n';
import messages from '../locales/*.json';
import App from './app.vue';

const i18n = createI18n({
  legacy: false,
  locale: navigator.language,
  fallbackLocale: 'en',
  availableLocales: Object.keys(messages),
  messages
});

const vuetify = createVuetify({
  components: {
    VApp,
    VAutocomplete,
    VBadge,
    VBtn,
    VCard,
    VCardActions,
    VCardItem,
    VCardSubtitle,
    VCardText,
    VCardTitle,
    VChip,
    VDialog,
    VDivider,
    VExpandTransition,
    VFileInput,
    VIcon,
    VList,
    VListGroup,
    VListItem,
    VListItemSubtitle,
    VListItemTitle,
    VListSubheader,
    VMain,
    VMenu,
    VNavigationDrawer,
    VSkeletonLoader,
    VSnackbar,
    VSpacer,
    VToolbar,
    VToolbarTitle,
    VTooltip,
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'myTheme',
    themes: {
      myTheme: {
        colors: {
          primary: '#6667ad'
        }
      }
    }
  }
});

createApp(App)
  .use(vuetify)
  .use(i18n)
  .mount('#app');
