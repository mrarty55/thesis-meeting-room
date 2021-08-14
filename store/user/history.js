export const state = () => ({
  bookings: [],
})

export const mutations = {
  get(state, payload) {
    state.bookings = payload
  },
}

export const actions = {
  async getBookingHistory({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings/me/history', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.user.auth.token}`,
          },
        },
      })
      commit('get', response.bookings)
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
