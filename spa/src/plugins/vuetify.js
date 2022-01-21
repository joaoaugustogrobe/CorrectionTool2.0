import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VTooltip from 'v-tooltip';

import 'font-awesome/css/font-awesome.min.css' // Ensure you are using css-loader


Vue.use(Vuetify);
Vue.use(VTooltip, {
    popover: {
      defaultHandleResize: false
    }
  });

export default new Vuetify({
  icons: {
    iconfont: 'fa4', // default - only for display purposes
  },
});
