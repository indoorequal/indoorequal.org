import Vue from 'vue';
import Vuetify, {
  VApp,
  VBtn,
  VCol,
  VExpansionPanel,
  VExpansionPanelContent,
  VExpansionPanelHeader,
  VExpansionPanels,
  VFileInput,
  VIcon,
  VMain,
  VRow,
  VTextField,
} from 'vuetify/lib';
import App from './remote.vue';

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VCol,
    VExpansionPanel,
    VExpansionPanelContent,
    VExpansionPanelHeader,
    VExpansionPanels,
    VFileInput,
    VIcon,
    VMain,
    VRow,
    VTextField,
  }
});

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    themes: {
      light: {
        primary: '#6667ad',
      },
    },
  },
});

new Vue({
  vuetify,
  render: createEle => createEle(App),
}).$mount('#app');
