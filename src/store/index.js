import { createStore } from 'vuex'
import AuthForm from '@/components/AuthForm.vue'

export default createStore({
  state: {
    user: null,
    events: []
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData
      if (userData) {
        localStorage.setItem('authToken', btoa(JSON.stringify(userData)))
      }
    },
    updateUser(state, payload) {
      state.user = { ...state.user, ...payload }
      localStorage.setItem('authToken', btoa(JSON.stringify(state.user)))
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem('authToken')
    }
  },
  actions: {
    async initialize({ commit }) {
      const authToken = localStorage.getItem('authToken')
      if (authToken) {
        try {
          const userData = JSON.parse(atob(authToken))
          commit('setUser', userData)
        } catch (e) {
          console.error('Ошибка декодирования токена:', e)
          commit('clearUser')
        }
      }
    },

    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials)
        const userData = JSON.parse(atob(response.token))
        commit('setUser', userData)
        return true
      } catch (error) {
        console.error('Ошибка авторизации:', error)
        throw error
      }
    },

    logout({ commit }) {
      commit('clearUser')
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === 'admin',
    currentUser: state => state.user,
    userEvents: state => state.events.filter(event => event.userId === state.user?.id)
  }
})