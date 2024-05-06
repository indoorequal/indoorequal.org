__VUE_OPTIONS_API__ = true;

if (process.env.NODE_ENV !== 'production') {
  __VUE_PROD_DEVTOOLS__ = true;
} else {
  __VUE_PROD_DEVTOOLS__ = false;
}
__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

import 'maplibre-gl/dist/maplibre-gl.css';
import 'vuetify/lib/styles/main.sass';

import { createApp } from 'vue';
import { createVuetify } from 'vuetify';

import { VApp } from 'vuetify/lib/components/VApp/VApp.mjs';
import { VAutocomplete } from 'vuetify/lib/components/VAutocomplete/VAutocomplete.mjs';
import { VBadge } from 'vuetify/lib/components/VBadge/VBadge.mjs';
import { VBtn } from 'vuetify/lib/components/VBtn/VBtn.mjs';
import { VCard } from 'vuetify/lib/components/VCard/VCard.mjs';
import { VCardActions } from 'vuetify/lib/components/VCard/VCardActions.mjs';
import { VCardSubtitle } from 'vuetify/lib/components/VCard/VCardSubtitle.mjs';
import { VCardText } from 'vuetify/lib/components/VCard/VCardText.mjs';
import { VCardTitle } from 'vuetify/lib/components/VCard/VCardTitle.mjs';
import { VChip } from 'vuetify/lib/components/VChip/VChip.mjs';
import { VDialog } from 'vuetify/lib/components/VDialog/VDialog.mjs';
import { VDivider } from 'vuetify/lib/components/VDivider/VDivider.mjs';
import { VExpandTransition } from 'vuetify/lib/components/transitions/index.mjs';
import { VFileInput } from 'vuetify/lib/components/VFileInput/index.mjs';
import { VIcon } from 'vuetify/lib/components/VIcon/VIcon.mjs';
import { VList } from 'vuetify/lib/components/VList/VList.mjs';
import { VListGroup } from 'vuetify/lib/components/VList/VListGroup.mjs';
import { VListItem } from 'vuetify/lib/components/VList/VListItem.mjs';
import { VListItemSubtitle } from 'vuetify/lib/components/VList/VListItemSubtitle.mjs';
import { VListItemTitle } from 'vuetify/lib/components/VList/VListItemTitle.mjs';
import { VListSubheader } from 'vuetify/lib/components/VList/VListSubheader.mjs';
import { VMain } from 'vuetify/lib/components/VMain/VMain.mjs';
import { VMenu } from 'vuetify/lib/components/VMenu/VMenu.mjs';
import { VNavigationDrawer } from 'vuetify/lib/components/VNavigationDrawer/VNavigationDrawer.mjs';
import { VSkeletonLoader } from 'vuetify/lib/components/VSkeletonLoader/VSkeletonLoader.mjs';
import { VSnackbar } from 'vuetify/lib/components/VSnackbar/VSnackbar.mjs';
import { VSpacer } from 'vuetify/lib/components/VGrid/VSpacer.mjs';
import { VToolbar } from 'vuetify/lib/components/VToolbar/VToolbar.mjs';
import { VToolbarTitle } from 'vuetify/lib/components/VToolbar/VToolbarTitle.mjs';
import { VTooltip } from 'vuetify/lib/components/VTooltip/VTooltip.mjs';

import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg';

import { createI18n } from 'vue-i18n';
import messages from '../locales/*.json';
import App from './app.vue';

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.split('-')[0],
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
