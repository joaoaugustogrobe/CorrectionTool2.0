import Vue from 'vue';

export default {
  namespaced: true,
  state: {},
  mutations: {
    set: (state, payload) => {
      const { type, status } = payload;

      if (type && typeof status !== undefined) {
        Vue.set(state, type, status);
      }
    },
  },
};
