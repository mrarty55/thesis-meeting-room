export const state = () => ({
  bookings: [],
})

export const mutations = {
  get(state, payload) {
    state.bookings = payload
  },
}

export const actions = {
  async getBookingReport({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/reports/bookings', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.bookings)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
