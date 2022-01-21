import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import professor from './modulos/professor.js';
import loading from './modulos/loading.js';
import comum from './modulos/comum.js';
import core from './modulos/core.js';


Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: true,
  modules: {
    loading,
    professor,
    comum,
    core,
  },
});

// // handle state loading
// store.subscribeAction({
//   before: (action) => {
//     store.commit('loading/set', { type: action.type, status: true });
//   },
//   after: (action) => {
//     store.commit('loading/set', { type: action.type, status: false });
//   },
// });

export default store;
