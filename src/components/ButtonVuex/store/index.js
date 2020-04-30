import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    count: state => state.count
  },
  actions: {
    increment (commit, { by }) {
      commit('INCREMENT_COUNT_BY', { by })
    }
  },
  mutations: {
    'INCREMENT_COUNT_BY' (state, { by }) {
      state.count += by
    }
  }
})
