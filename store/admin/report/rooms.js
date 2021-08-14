export const state = () => ({
  rooms: [],
})

export const mutations = {
  get(state, payload) {
    state.rooms = payload
  },
}

export const actions = {
  async getRoomReport({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/reports/rooms', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.rooms)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
