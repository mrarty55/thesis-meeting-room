export const state = () => ({
  summary: {},
  rooms: [],
  drinks: [],
  statusRatio: [],
})

export const mutations = {
  getSummary(state, payload) {
    state.summary = Object.assign({}, payload)
  },
  getRooms(state, payload) {
    state.rooms = payload
  },
  getDrinks(state, payload) {
    state.drinks = payload
  },
  getStatusRatio(state, payload) {
    state.statusRatio = payload
  },
}

export const actions = {
  async getDashboardData({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/reports/dashboard', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('getSummary', response.dashboard.summary)
      commit('getRooms', response.dashboard.rooms)
      commit('getDrinks', response.dashboard.drinks)
      commit('getStatusRatio', response.dashboard.statusRatio)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
