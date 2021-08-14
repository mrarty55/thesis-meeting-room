export const state = () => ({
  bookings: [],
  detailsDialog: false,
})

export const mutations = {
  toggleDetails(state, payload) {
    state.detailsDialog = payload
  },
  getBookings(state, payload) {
    state.bookings = payload
  },
}

export const actions = {
  async getBookings({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('getBookings', response.bookings)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
