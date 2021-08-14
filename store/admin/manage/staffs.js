export const state = () => ({
  staffs: [],
  roles: [],
  loading: false,
  error: false,
  detailsDialog: false,
  editDialog: false,
  deleteDialog: false,
})

export const mutations = {
  create(state, payload) {
    state.staffs.push(payload)
  },
  update(state, payload) {
    Object.assign(state.staffs[payload.index], payload.staff)
  },
  delete(state, payload) {
    state.staffs.splice(payload, 1)
  },
  get(state, payload) {
    state.staffs = payload
  },
  getRoles(state, payload) {
    state.roles = payload
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
  async createStaff({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      const response = await this.$axios.$post(
        '/admins',
        {
          firstName: payload.staff.firstName,
          lastName: payload.staff.lastName,
          username: payload.staff.username,
          password: payload.password,
          email: payload.staff.email,
          phoneNumber: payload.staff.phoneNumber,
          roleId: payload.staff.role,
          profilePicture: payload.staff.profilePicture,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.admin.auth.token}`,
            },
          },
        }
      )
      payload.staff.id = response.staffId
      commit('create', payload.staff)
      commit('toggleLoading', false)
      commit('toggleEdit', false)
      this.$notifier.showMessage({
        message: `ສ້າງຜູ້ໃຊ້ສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການສ້າງຜູ້ໃຊ້: ${message}`,
        color: 'error',
      })
    }
  },
  async updateStaff({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$put(
        `/admins`,
        {
          id: payload.staff.id,
          firstName: payload.staff.firstName,
          lastName: payload.staff.lastName,
          email: payload.staff.email,
          phoneNumber: payload.staff.phoneNumber,
          roleId: payload.staff.role,
          profilePicture: payload.staff.profilePicture,
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
  async deleteStaff({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$delete('/admins', {
        data: { id: payload.staffId },
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
  async getStaffs({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/admins/all', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.staffs)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
  async getRoles({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/admins/roles', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('getRoles', response.roles)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
