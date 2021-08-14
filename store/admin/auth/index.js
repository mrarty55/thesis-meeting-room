export const state = () => ({
  id: '',
  username: '',
  role: '',
  image: '',
  token: '',
  message: '',
  loading: false,
})

export const mutations = {
  setAuthData(state, credentials) {
    state.id = credentials.id
    state.username = credentials.username
    state.role = credentials.role
    state.image = credentials.image
    state.token = credentials.token
  },
  updatePicture(state, image) {
    state.image = image
  },
  clearAuthData(state) {
    state.id = ''
    state.username = ''
    state.role = ''
    state.image = ''
    state.token = ''
  },
  setMessage(state, message) {
    state.message = message
  },
  toggleLoading(state, status) {
    state.loading = status
  },
}

export const actions = {
  async login({ commit }, credentials) {
    commit('toggleLoading', true)
    commit('setMessage', '')
    try {
      const response = await this.$axios.$post('/admins/login', {
        username: credentials.username,
        password: credentials.password,
      })
      commit('setAuthData', response)
      commit('toggleLoading', false)
      this.$router.push('/admin/dashboard')
    } catch (error) {
      let message = 'ມີຂໍ້ຜິດພາດໃນການເຂົ້າໃຊ້ລະບົບ'
      switch (error.response?.status) {
        case 401:
          message = 'ຊື່ຜູ້ໃຊ້ຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ'
          break
        case 400:
          message = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ'
          break
        default:
          message = 'ມີຂໍ້ຜິດພາດໃນການເຂົ້າໃຊ້ລະບົບ'
      }
      commit('toggleLoading', false)
      commit('setMessage', message)
    }
  },
  logout({ commit }) {
    commit('clearAuthData')
    this.$router.push('/admin/login')
  },
}
