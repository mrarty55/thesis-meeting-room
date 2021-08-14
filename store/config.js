export const state = () => ({
  settings: [],
})

export const getters = {
  tableAmount(state, getters) {
    return state.settings.find((setting) => setting.id === 1)?.value
  },
  chairAmount(state, getters) {
    return state.settings.find((setting) => setting.id === 2)?.value
  },
  depositPercent(state, getters) {
    return state.settings.find((setting) => setting.id === 3)?.value
  },
}

export const mutations = {
  get(state, payload) {
    state.settings = payload
  },
}

export const actions = {
  async getSettings({ commit }) {
    try {
      const response = await this.$axios.$get('/settings')
      commit('get', response.settings)
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
  async updateSettings({ commit, rootState }, payload) {
    try {
      await this.$axios.$put(
        '/settings',
        { settings: payload },
        {
          headers: {
            common: { Authorization: `Bearer ${rootState.admin.auth.token}` },
          },
        }
      )
      commit('get', payload)
      this.$notifier.showMessage({
        message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ',
        color: 'success',
      })
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
