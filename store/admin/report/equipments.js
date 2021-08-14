export const state = () => ({
  equipments: [],
})

export const mutations = {
  get(state, payload) {
    state.equipments = payload
  },
}

export const actions = {
  async getEquipmentReport({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/reports/equipments', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.equipments)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
