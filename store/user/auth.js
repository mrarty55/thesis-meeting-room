export const state = () => ({
  id: '',
  username: '',
  token: '',
  image: '',
  message: '',
  loading: false,
})

export const mutations = {
  setAuthData(state, credentials) {
    state.id = credentials.id
    state.username = credentials.username
    state.image = credentials.image
    state.token = credentials.token
  },
  updatePicture(state, image) {
    state.image = image
  },
  clearAuthData(state) {
    state.id = ''
    state.username = ''
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
      const response = await this.$axios.$post('/users/login', {
        username: credentials.username,
        password: credentials.password,
      })
      commit('setAuthData', response)
      commit('toggleLoading', false)
      this.$router.push('/user/service')
    } catch (error) {
      let message = 'ມີຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ'
      switch (error.response?.status) {
        case 401:
          message = 'ຊື່ຜູ້ໃຊ້ຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ'
          break
        case 400:
          message = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ'
          break
        default:
          message = 'ມີຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ'
      }
      commit('setMessage', message)
      commit('toggleLoading', false)
    }
  },
  logout(context) {
    context.commit('clearAuthData')
    this.$router.push('/login')
  },
  async register({ commit }, credentials) {
    commit('toggleLoading', true)
    commit('clearMessage')
    try {
      await this.$axios.$post('/users', {
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        phoneNumber: credentials.phoneNumber,
        username: credentials.username,
        password: credentials.password,
      })
      commit('toggleLoading', false)
      this.$router.push('/register-success')
    } catch (error) {
      let message = ''
      switch (error.response.status) {
        case 400:
          message = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ'
          break
        default:
          message = 'ມີຂໍ້ຜິດພາດໃນການລົງທະບຽນ'
      }
      commit('setMessage', message)
      commit('toggleLoading', false)
    }
  },
}
