export const state = () => ({
  drinks: [],
  loading: false,
  error: false,
  detailsDialog: false,
  editDialog: false,
  deleteDialog: false,
})

export const mutations = {
  create(state, payload) {
    state.drinks.push(payload)
  },
  update(state, payload) {
    Object.assign(state.drinks[payload.index], payload.drink)
  },
  delete(state, payload) {
    state.drinks.splice(payload, 1)
  },
  get(state, payload) {
    state.drinks = payload
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
  async createDrink({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      const response = await this.$axios.$post(
        '/drinks',
        {
          name: payload.name,
          description: payload.description,
          price: payload.price,
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
      payload.id = response.drinkId
      commit('create', payload)
      commit('toggleLoading', false)
      commit('toggleEdit', false)
      this.$notifier.showMessage({
        message: `ເພີ່ມຂໍ້ມູນເຄື່ອງດື່ມສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການເພີ່ມຂໍ້ມູນເຄື່ອງດື່ມ: ${message}`,
        color: 'error',
      })
    }
  },
  async updateDrink({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$put(
        `/drinks`,
        {
          id: payload.drink.id,
          name: payload.drink.name,
          description: payload.drink.description,
          price: payload.drink.price,
          image: payload.drink.image,
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
        message: `ແກ້ໄຂຂໍ້ມູນເຄື່ອງດື່ມສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນເຄື່ອງດື່ມ: ${message}`,
        color: 'error',
      })
    }
  },
  async deleteDrink({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$delete(`/drinks`, {
        data: { id: payload.drinkId },
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
        message: `ລຶບຂໍ້ມູນເຄື່ອງດື່ມສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການລຶບຂໍ້ມູນເຄື່ອງດື່ມ: ${message}`,
        color: 'error',
      })
    }
  },
  async getDrinks({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/drinks', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.drinks)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
