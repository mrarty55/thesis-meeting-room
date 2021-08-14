export const state = () => ({
  rents: [],
})

export const mutations = {
  get(state, payload) {
    state.rents = payload
  },
}

export const actions = {
  async getRentReport({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/reports/rents', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.rents)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
