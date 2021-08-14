export const state = () => ({
  equipments: [],
  loading: false,
  error: false,
  detailsDialog: false,
  editDialog: false,
  deleteDialog: false,
})

export const mutations = {
  create(state, payload) {
    state.equipments.push(payload)
  },
  update(state, payload) {
    Object.assign(state.equipments[payload.index], payload.equipment)
  },
  delete(state, payload) {
    state.equipments.splice(payload, 1)
  },
  get(state, payload) {
    state.equipments = payload
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
  async createEquipment({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      const response = await this.$axios.$post(
        '/equipments',
        {
          name: payload.name,
          description: payload.description,
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
      payload.id = response.equipmentId
      commit('create', payload)
      commit('toggleLoading', false)
      commit('toggleEdit', false)
      this.$notifier.showMessage({
        message: `ເພີ່ມຂໍ້ມູນອຸປະກອນສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການເພີ່ມຂໍ້ມູນອຸປະກອນ: ${message}`,
        color: 'error',
      })
    }
  },
  async updateEquipment({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$put(
        `/equipments`,
        {
          id: payload.equipment.id,
          name: payload.equipment.name,
          description: payload.equipment.description,
          image: payload.equipment.image,
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
        message: `ແກ້ໄຂຂໍ້ມູນອຸປະກອນສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການແກ້ໄຂຂໍ້ມູນອຸປະກອນ: ${message}`,
        color: 'error',
      })
    }
  },
  async deleteEquipment({ commit, rootState }, payload) {
    commit('toggleError', false)
    commit('toggleLoading', true)
    try {
      await this.$axios.$delete(`/equipments`, {
        data: { id: payload.equipmentId },
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
        message: `ລຶບຂໍ້ມູນອຸປະກອນສຳເລັດ`,
        color: 'success',
      })
    } catch (error) {
      commit('toggleError', true)
      commit('toggleLoading', false)
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການລຶບຂໍ້ມູນອຸປະກອນ: ${message}`,
        color: 'error',
      })
    }
  },
  async getEquipments({ commit, rootState }) {
    try {
      const response = await this.$axios.$get('/equipments', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.admin.auth.token}`,
          },
        },
      })
      commit('get', response.equipments)
    } catch (error) {
      const message = error.response.data.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
