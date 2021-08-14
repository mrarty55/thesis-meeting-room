export const state = () => ({
  drinks: [],
})

export const mutations = {
  get(state, payload) {
    state.drinks = payload
  },
}

export const actions = {
  async getDrinkReport({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/reports/drinks', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.drinks)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
}
