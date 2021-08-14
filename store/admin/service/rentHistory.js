export const state = () => ({
  rents: [],
  detailsDialog: false,
})

export const mutations = {
  toggleDetails(state, payload) {
    state.detailsDialog = payload
  },
  getRents(state, payload) {
    state.rents = payload
  },
}

export const actions = {
  async getRents({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/rents', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('getRents', response.rents)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
