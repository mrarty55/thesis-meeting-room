export const state = () => ({
  confirmedBookings: [],
  eventTypes: [],
  eventStatus: [],
  roomStyles: [],
  loading: false,
  error: false,
  detailsDialog: false,
  editDialog: false,
  checkinDialog: false,
  checkinSuccess: false,
})

export const mutations = {
  getConfirmed(state, payload) {
    state.confirmedBookings = payload
  },
  updateBooking(state, payload) {
    Object.assign(state.confirmedBookings[payload.index], payload.booking)
  },
  deleteConfirmed(state, payload) {
    state.confirmedBookings.splice(payload, 1)
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
  toggleCheckin(state, payload) {
    state.checkinDialog = payload
  },
  toggleCheckinSuccess(state, payload) {
    state.checkinSuccess = payload
  },
  toggleReceipt(state, payload) {
    state.receiptDialog = payload
  },
}

export const actions = {
  async getConfirmedBookings({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings/confirmed', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('getConfirmed', response.bookings)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
  async getEditFormData({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings/data/editForm', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
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
              Authorization: `Bearer ${rootState.admin.auth.token}`,
            },
          },
        }
      )
      commit('updateBooking', payload)
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
  async checkin({ commit, rootState }, payload) {
    commit('toggleLoading', true)
    commit('toggleError', false)
    try {
      await this.$axios.$post(
        '/rents',
        {
          bookingId: payload.bookingId,
          received: payload.received,
          change: payload.change,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.admin.auth.token}`,
            },
          },
        }
      )
      commit('deleteConfirmed', payload.index)
      commit('toggleCheckinSuccess', true)
      this.$notifier.showMessage({
        message: `ແຈ້ງເຂົ້າສໍາເລັດແລ້ວ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleCheckinSuccess', false)
      commit('toggleLoading', false)
      commit('toggleError', true)
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
