export const state = () => ({
  schedule: [],
  rooms: [],
})

export const mutations = {
  getBookingSchedule(state, payload) {
    const schedule = payload.map((item) => ({
      name: item.name,
      start: new Date(item.start),
      end: new Date(item.end),
      date: item.date,
      timed: true,
    }))
    state.schedule = schedule
  },
  getAvailableRooms(state, payload) {
    state.rooms = payload
  },
}

export const actions = {
  async getBookingSchedule({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings/schedule', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.user.auth.token}`,
          },
        },
      })
      commit('getBookingSchedule', response.bookings)
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
  async getAvailableRooms({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/rooms/public')
      commit('getAvailableRooms', response.rooms)
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
