__VUE_OPTIONS_API__ = true;

if (process.env.NODE_ENV !== 'production') {
  __VUE_PROD_DEVTOOLS__ = true;
} else {
  __VUE_PROD_DEVTOOLS__ = false;
}
__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

import 'vuetify/lib/styles/main.sass';

import { createApp } from 'vue';
import { createVuetify } from 'vuetify';

import { VApp } from 'vuetify/lib/components/VApp/VApp.mjs';
import { VBtn } from 'vuetify/lib/components/VBtn/VBtn.mjs';
import { VMain } from 'vuetify/lib/components/VMain/VMain.mjs';
import { VFileInput } from 'vuetify/lib/components/VFileInput/index.mjs';
import { VTextField } from 'vuetify/lib/components/VTextField/index.mjs';
import { VIcon } from 'vuetify/lib/components/VIcon/VIcon.mjs';
import { VExpansionPanels } from 'vuetify/lib/components/VExpansionPanel/VExpansionPanels.mjs';
import { VExpansionPanel } from 'vuetify/lib/components/VExpansionPanel/VExpansionPanel.mjs';
import { VExpansionPanelTitle } from 'vuetify/lib/components/VExpansionPanel/VExpansionPanelTitle.mjs';
import { VExpansionPanelText } from 'vuetify/lib/components/VExpansionPanel/VExpansionPanelText.mjs';
import { VRow } from 'vuetify/lib/components/VGrid/VRow.mjs';
import { VCol } from 'vuetify/lib/components/VGrid/VCol.mjs';

import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg';

import App from './remote.vue';

const vuetify = createVuetify({
  components: {
    VApp,
    VBtn,
    VMain,
    VFileInput,
    VTextField,
    VIcon,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelTitle,
    VExpansionPanelText,
    VCol,
    VRow,
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
  .mount('#app');
