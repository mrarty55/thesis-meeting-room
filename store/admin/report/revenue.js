export const state = () => ({
  revenue: {},
})

export const mutations = {
  get(state, payload) {
    state.revenue = payload
  },
}

export const actions = {
  async getRevenueReport({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/reports/revenue', {
        headers: {
          common: { Authorization: `Bearer ${rootState.admin.auth.token}` },
        },
      })
      commit('get', response.revenue)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
