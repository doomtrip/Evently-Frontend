import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }
  },
  getters: {
    isAdmin: state => state.user?.role === 'admin'
  }
})