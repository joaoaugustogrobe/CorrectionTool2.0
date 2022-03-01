import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    user: {},
  },
  mutations: {
    set: (state, payload) => {
      Object.keys(payload).forEach(key => {
        Vue.set(state, key, payload[key]);
      });
    },
    showMessage: () => {
    },
  },
  getters: {
    user: (state) => {
      return state['user'] || {};
    },
    isProfessor: (state, getters) => {
      return getters['user'].role === 'professor';
    },
    isAluno: (state, getters) => {
      return getters['user'].role === 'aluno';
    }
  }
};
