export const state = () => ({
  bookings: [],
  bookingStatus: [],
  eventTypes: [],
  eventStatus: [],
  roomStyles: [],
  loading: false,
  error: false,
  detailsDialog: false,
  editDialog: false,
  depositDialog: false,
  cancelDialog: false,
})

export const mutations = {
  get(state, payload) {
    state.bookings = payload
  },
  update(state, payload) {
    Object.assign(state.bookings[payload.index], payload.booking)
  },
  delete(state, payload) {
    state.bookings.splice(payload.index, 1)
  },
  getBookingStatus(state, payload) {
    state.bookingStatus = payload
  },
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
  getEditFormData(state, payload) {
    state.eventTypes = payload.eventTypes
    state.eventStatus = payload.eventStatus
    state.roomStyles = payload.roomStyles
  },
  toggleLoading(state, payload) {
    state.loading = payload
  },
  toggleError(state, payload) {
    state.error = payload
  },
  toggleDetails(state, payload) {
    state.detailsDialog = payload
  },
  toggleEdit(state, payload) {
    state.editDialog = payload
  },
  toggleDeposit(state, payload) {
    state.depositDialog = payload
  },
  toggleCancel(state, payload) {
    state.cancelDialog = payload
  },
}

export const actions = {
  async getBookings({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings/me', {
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
  async getBookingStatus({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings/data/status', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.user.auth.token}`,
          },
        },
      })
      commit('getBookingStatus', response.bookingStatus)
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
  async getEditFormData({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings/data/editForm', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.user.auth.token}`,
          },
        },
      })
      commit('getEditFormData', response)
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
  async updateBooking({ commit, rootState }, payload) {
    commit('toggleLoading', true)
    commit('toggleError', false)
    try {
      await this.$axios.put(
        '/bookings',
        {
          id: payload.booking.id,
          eventTitle: payload.booking.eventTitle,
          eventDescription: payload.booking.eventDescription,
          eventType: payload.booking.eventType.id,
          eventStatus: payload.booking.eventStatus.id,
          roomStyle: payload.booking.roomStyle.id,
          additionalNote: payload.booking.additionalNote,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.user.auth.token}`,
            },
          },
        }
      )
      commit('update', payload)
      commit('toggleLoading', false)
      commit('toggleEdit', false)
      this.$notifier.showMessage({
        message: `ແກ້ໄຂຂໍ້ມູນການຈອງສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
  async updateDepositStatement({ commit, rootState }, payload) {
    commit('toggleLoading', true)
    commit('toggleError', false)
    try {
      await this.$axios.$patch(
        '/bookings/deposit',
        {
          bookingId: payload.booking.id,
          depositStatement: payload.booking.depositStatement,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.user.auth.token}`,
            },
          },
        }
      )
      commit('toggleLoading', false)
      commit('toggleDeposit', false)
      commit('update', payload)
      this.$notifier.showMessage({
        message: 'ອັບໂຫຼດສໍາເລັດ',
        color: 'success',
      })
    } catch (error) {
      commit('toggleLoading', false)
      commit('toggleError', true)
      let message = ''
      switch (error.response.status) {
        case 400:
          message = 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງຄົບຖ້ວນ'
          break
        default:
          message = 'ບັນຫາພາຍໃນລະບົບ'
          break
      }
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການອັບໂຫຼດ: ${message}`,
        color: 'error',
      })
    }
  },
  async cancelBooking({ commit, rootState }, payload) {
    commit('toggleLoading', true)
    commit('toggleError', false)
    try {
      await this.$axios.$patch(
        '/bookings/me/cancel',
        { booking: payload.booking },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.user.auth.token}`,
            },
          },
        }
      )
      commit('toggleLoading', false)
      commit('toggleCancel', false)
      commit('delete', payload.index)
      this.$notifier.showMessage({
        message: 'ຍົກເລີກການຈອງສໍາເລັດ',
        color: 'success',
      })
    } catch (error) {
      commit('toggleLoading', false)
      commit('toggleError', true)
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການຍົກເລີກການຈອງ: ${message}`,
        color: 'error',
      })
    }
  },
}
