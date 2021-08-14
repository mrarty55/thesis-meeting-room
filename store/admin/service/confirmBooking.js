export const state = () => ({
  pendingBookings: [],
  eventTypes: [],
  eventStatus: [],
  roomStyles: [],
  loading: false,
  error: false,
  detailsDialog: false,
  editDialog: false,
  confirmDialog: false,
  cancelDialog: false,
})

export const mutations = {
  getPending(state, payload) {
    state.pendingBookings = payload
  },
  updateBooking(state, payload) {
    Object.assign(state.pendingBookings[payload.index], payload.booking)
  },
  deletePending(state, payload) {
    state.pendingBookings.splice(payload, 1)
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
  toggleConfirm(state, payload) {
    state.confirmDialog = payload
  },
  toggleCancel(state, payload) {
    state.cancelDialog = payload
  },
}

export const actions = {
  async getPendingBookings({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/bookings/pending', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('getPending', response.bookings)
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
  async confirmBooking({ commit, rootState }, payload) {
    commit('toggleLoading', true)
    commit('toggleError', false)
    try {
      await this.$axios.$patch(
        '/bookings/confirm',
        {
          booking: payload.booking,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.admin.auth.token}`,
            },
          },
        }
      )
      commit('deletePending', payload.index)
      commit('toggleLoading', false)
      commit('toggleConfirm', false)
      this.$notifier.showMessage({
        message: 'ຢືນຢັນການຈອງສໍາເລັດ',
        color: 'success',
      })
    } catch (error) {
      commit('toggleLoading', false)
      commit('toggleError', true)
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການຢືນຢັນການຈອງ: ${message}`,
        color: 'error',
      })
    }
  },
  async cancelBooking({ commit, rootState }, payload) {
    commit('toggleLoading', true)
    commit('toggleError', false)
    try {
      await this.$axios.$patch(
        '/bookings/cancel',
        { booking: payload.booking },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.admin.auth.token}`,
            },
          },
        }
      )
      commit('deletePending', payload.index)
      commit('toggleLoading', false)
      commit('toggleCancel', false)
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
