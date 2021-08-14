export const state = () => ({
  customers: [],
  loading: false,
  error: false,
  detailsDialog: false,
  editDialog: false,
  deleteDialog: false,
})

export const mutations = {
  update(state, payload) {
    Object.assign(state.customers[payload.index], payload.customer)
  },
  delete(state, payload) {
    state.customers.splice(payload, 1)
  },
  get(state, payload) {
    state.customers = payload
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
  async updateCustomer({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.put(
        '/users',
        {
          id: payload.customer.id,
          firstName: payload.customer.firstName,
          lastName: payload.customer.lastName,
          email: payload.customer.email,
          phoneNumber: payload.customer.phoneNumber,
          workplace: payload.customer.workplace,
          occupation: payload.customer.occupation,
          address: payload.customer.address,
          profilePicture: payload.customer.profilePicture,
          identification: payload.customer.identification,
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
        message: `ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້: ${message}`,
        color: 'error',
      })
    }
  },
  async deleteCustomer({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$delete('/users', {
        data: { id: payload.customerId },
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
        message: `ລຶບຜູ້ໃຊ້ສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການລຶບຜູ້ໃຊ້: ${message}`,
        color: 'error',
      })
    }
  },
  async getUsers({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/users/all', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.customers)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
