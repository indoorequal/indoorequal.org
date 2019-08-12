import 'mapbox-gl/dist/mapbox-gl.css';

import Vue from 'vue';

import App from './app.vue';

new Vue({
  render: createEle => createEle(App),
}).$mount('#app');
