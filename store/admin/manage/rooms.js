export const state = () => ({
  rooms: [],
  loading: false,
  error: false,
  detailsDialog: false,
  editDialog: false,
  deleteDialog: false,
})

export const mutations = {
  create(state, payload) {
    state.rooms.push(payload)
  },
  update(state, payload) {
    Object.assign(state.rooms[payload.index], payload.room)
  },
  delete(state, payload) {
    state.rooms.splice(payload, 1)
  },
  get(state, payload) {
    state.rooms = payload
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
  toggleDelete(state, payload) {
    state.deleteDialog = payload
  },
}

export const actions = {
  async createRoom({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      const response = await this.$axios.$post(
        '/rooms',
        {
          name: payload.name,
          description: payload.description,
          hourlyRate: payload.hourlyRate,
          shiftRate: payload.shiftRate,
          capacity: payload.capacity,
          image: payload.image,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.admin.auth.token}`,
            },
          },
        }
      )
      payload.id = response.roomId
      commit('create', payload)
      commit('toggleLoading', false)
      commit('toggleEdit', false)
      this.$notifier.showMessage({
        message: `ເພີ່ມຂໍ້ມູນຫ້ອງສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການເພີ່ມຂໍ້ມູນຫ້ອງ: ${message}`,
        color: 'error',
      })
    }
  },
  async updateRoom({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$put(
        `/rooms`,
        {
          id: payload.room.id,
          name: payload.room.name,
          description: payload.room.description,
          hourlyRate: payload.room.hourlyRate,
          shiftRate: payload.room.shiftRate,
          capacity: payload.room.capacity,
          image: payload.room.image,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.admin.auth.token}`,
            },
          },
        }
      )
      commit('update', payload)
      commit('toggleLoading', false)
      commit('toggleEdit', false)
      this.$notifier.showMessage({
        message: `ແກ້ໄຂຂໍ້ມູນຫ້ອງສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນຫ້ອງ: ${message}`,
        color: 'error',
      })
    }
  },
  async deleteRoom({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$delete(`/rooms`, {
        data: { id: payload.roomId },
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('delete', payload.index)
      commit('toggleLoading', false)
      commit('toggleDelete', false)
      this.$notifier.showMessage({
        message: `ລຶບຂໍ້ມູນຫ້ອງສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການລຶບຂໍ້ມູນຫ້ອງ: ${message}`,
        color: 'error',
      })
    }
  },
  async getRooms({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/rooms', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.rooms)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
