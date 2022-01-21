import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
var VueCookie = require('vue-cookie');
import VModal from 'vue-js-modal'

import './scss/main.scss'


import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'
// Tell Vue to use the plugin
Vue.use(VueCookie);

Vue.use(VModal, { componentName: 'vue-modal' });
Vue.use(VModal)




Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
