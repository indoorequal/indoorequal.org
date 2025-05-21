import 'vuetify/lib/styles/main.sass';

import { createApp } from 'vue';
import { createVuetify } from 'vuetify';

import { VApp } from 'vuetify/lib/components/VApp/VApp.js';
import { VBtn } from 'vuetify/lib/components/VBtn/VBtn.js';
import { VMain } from 'vuetify/lib/components/VMain/VMain.js';
import { VFileInput } from 'vuetify/lib/components/VFileInput/index.js';
import { VTextField } from 'vuetify/lib/components/VTextField/index.js';
import { VIcon } from 'vuetify/lib/components/VIcon/VIcon.js';
import { VExpansionPanels } from 'vuetify/lib/components/VExpansionPanel/VExpansionPanels.js';
import { VExpansionPanel } from 'vuetify/lib/components/VExpansionPanel/VExpansionPanel.js';
import { VExpansionPanelTitle } from 'vuetify/lib/components/VExpansionPanel/VExpansionPanelTitle.js';
import { VExpansionPanelText } from 'vuetify/lib/components/VExpansionPanel/VExpansionPanelText.js';
import { VRow } from 'vuetify/lib/components/VGrid/VRow.js';
import { VCol } from 'vuetify/lib/components/VGrid/VCol.js';

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
