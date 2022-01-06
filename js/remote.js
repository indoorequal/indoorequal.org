import Vue from 'vue';
import Vuetify, {
  VApp,
  VFileInput,
  VIcon,
  VMain,
  VTextField,
} from 'vuetify/lib';
import App from './remote.vue';

Vue.use(Vuetify, {
  components: {
    VApp,
    VFileInput,
    VIcon,
    VMain,
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
