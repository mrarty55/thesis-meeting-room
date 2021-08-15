import minimumDate from '~/utils/date'
import { generateContract, generateQuotation } from '~/utils/pdf'

export const state = () => ({
  bookingId: '',
  eventTitle: '',
  eventDescription: '',
  eventType: {},
  eventStatus: {},
  eventDate: minimumDate(),
  eventStartTime: '8:00',
  eventEndTime: '12:00',
  rooms: [],
  equipments: [],
  drinks: [],
  roomStyle: {},
  chair: 0,
  table: 0,
  additionalNote: '',
  depositStatement: '',
  loading: false,
  errorMessage: '',
})

export const getters = {
  totalHours(state) {
    const startHour = parseInt(state.eventStartTime.split(':')[0])
    const endHour = parseInt(state.eventEndTime.split(':')[0])
    const startMinute = parseInt(state.eventStartTime.split(':')[1])
    const endMinute = parseInt(state.eventEndTime.split(':')[1])
    return Math.round(
      ((endHour - startHour) * 60 + (endMinute - startMinute)) / 60
    )
  },
  roomSubtotal(state, getters) {
    let subtotal = 0
    state.rooms.forEach((room) => {
      if (getters.totalHours % 4 === 0) {
        subtotal += room.shiftRate * (getters.totalHours / 4)
      } else {
        subtotal += room.hourlyRate * getters.totalHours
      }
    })
    return subtotal
  },
  drinkSubtotal(state) {
    let subtotal = 0
    state.drinks.forEach((drink) => (subtotal += drink.price * drink.amount))
    return subtotal
  },
  total(state, getters) {
    return getters.drinkSubtotal + getters.roomSubtotal
  },
  deposit(state, getters, rootState, rootGetters) {
    return getters.total * (rootGetters['config/depositPercent'] / 100)
  },
  roomsText(state) {
    let roomText = ''
    state.rooms.forEach((room, index, arr) => {
      if (index < arr.length - 1) {
        roomText += `${room.name}, `
      } else {
        roomText += `${room.name}.`
      }
    })
    return roomText
  },
  equipmentsText(state) {
    let equipmentText = ''
    state.equipments.forEach((equipment, index, arr) => {
      if (index < arr.length - 1) {
        equipmentText += `${equipment.name}, `
      } else {
        equipmentText += `${equipment.name}.`
      }
    })
    return equipmentText
  },
  drinksText(state) {
    let drinksText = ''
    state.drinks.forEach((drink, index, arr) => {
      if (index < arr.length - 1) {
        drinksText += `${drink.name} ຈໍານວນ ${drink.amount} ຈອກ, `
      } else {
        drinksText += `${drink.name} ຈໍານວນ ${drink.amount} ຈອກ.`
      }
    })
    return drinksText
  },
}

export const mutations = {
  id(state, payload) {
    state.bookingId = payload
  },
  title(state, payload) {
    state.eventTitle = payload
  },
  description(state, payload) {
    state.eventDescription = payload
  },
  type(state, payload) {
    state.eventType = payload
  },
  status(state, payload) {
    state.eventStatus = payload
  },
  date(state, payload) {
    state.eventDate = payload
  },
  start(state, payload) {
    state.eventStartTime = payload
  },
  end(state, payload) {
    state.eventEndTime = payload
  },
  rooms(state, payload) {
    state.rooms = payload
  },
  equipments(state, payload) {
    state.equipments = payload
  },
  drinks(state, payload) {
    state.drinks = payload
  },
  style(state, payload) {
    state.roomStyle = payload
  },
  table(state, payload) {
    state.table = payload
  },
  chair(state, payload) {
    state.chair = payload
  },
  note(state, payload) {
    state.additionalNote = payload
  },
  deposit(state, payload) {
    state.depositStatement = payload
  },
  clear(state) {
    state.eventTitle = ''
    state.eventDescription = ''
    state.eventType = {}
    state.eventStatus = {}
    state.eventDate = minimumDate()
    state.eventStartTime = '8:00'
    state.eventEndTime = '12:00'
    state.rooms = []
    state.equipments = []
    state.drinks = []
    state.roomStyle = {}
    state.table = 0
    state.chair = 0
    state.additionalNote = ''
  },
  loading(state, payload) {
    state.loading = payload
  },
  error(state, payload) {
    state.errorMessage = payload
  },
}
export const actions = {
  async checkRooms({ commit, state, rootState }) {
    commit('loading', true)
    commit('error', '')
    try {
      await this.$axios.$post(
        '/bookings/check',
        {
          rooms: state.rooms,
          eventDate: state.eventDate,
          eventStartTime: state.eventStartTime,
          eventEndTime: state.eventEndTime,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.user.auth.token}`,
            },
          },
        }
      )
      commit('loading', false)
      this.$router.push('/user/service/booking/review')
    } catch (error) {
      let message = ''
      switch (error.response.status) {
        case 403:
          message = 'ຫ້ອງທີ່ທ່ານເລືອກແມ່ນຖືກຈອງແລ້ວ'
          break
        default:
          message = ''
          break
      }
      commit('loading', false)
      commit('error', message)
    }
  },
  async uploadBookingData({ commit, state, getters, rootState }) {
    commit('loading', true)
    commit('error', '')
    try {
      const response = await this.$axios.$post(
        '/bookings',
        {
          eventTitle: state.eventTitle,
          eventDescription: state.eventDescription,
          eventType: state.eventType.id,
          eventStatus: state.eventStatus.id,
          eventDate: state.eventDate,
          eventStartTime: state.eventStartTime,
          eventEndTime: state.eventEndTime,
          rooms: state.rooms,
          equipments: state.equipments,
          drinks: state.drinks,
          roomStyle: state.roomStyle.id,
          table: state.table,
          chair: state.chair,
          additionalNote: state.additionalNote,
          roomSubtotal: getters.roomSubtotal,
          drinkSubtotal: getters.drinkSubtotal,
          total: getters.total,
          deposit: getters.deposit,
          customer: rootState.user.auth.id,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.user.auth.token}`,
            },
          },
        }
      )
      commit('loading', false)
      commit('id', response.bookingId)
      this.$router.push('/user/service/booking/deposit')
    } catch (error) {
      let message = ''
      switch (error.response.status) {
        case 400:
          message = 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງຄົບຖ້ວນ'
          break
        case 403:
          message = 'ຫ້ອງທີ່ທ່ານເລືອກແມ່ນຖືກຈອງແລ້ວ'
          break
        default:
          message = 'ມີຂໍ້ຜິດພາດໃນການຈອງ'
          break
      }
      commit('loading', false)
      commit('error', message)
    }
  },
  async uploadDepositStatement({ commit, rootState, state }) {
    commit('loading', true)
    commit('error', '')
    try {
      await this.$axios.$patch(
        '/bookings/deposit',
        {
          bookingId: state.bookingId,
          depositStatement: state.depositStatement,
        },
        {
          headers: {
            common: {
              Authorization: `Bearer ${rootState.user.auth.token}`,
            },
          },
        }
      )
      commit('loading', false)
      this.$router.push('/user/service/booking/success')
    } catch (error) {
      commit('loading', false)
      let message = ''
      switch (error.response.status) {
        case 400:
          message = 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງຄົບຖ້ວນ'
          break
        default:
          message = 'ມີຂໍ້ຜິດພາດໃນການອັບໂຫຼດຫຼັກຖານການຊໍາລະຄ່າມັດຈໍາ'
          break
      }
      commit('error', message)
    }
  },
  async generateContract({ state, rootState }) {
    try {
      const response = await this.$axios.$get('/users', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.user.auth.token}`,
          },
        },
      })
      const customer = response.customer
      const data = {
        id: state.bookingId,
        customer,
        eventTitle: state.eventTitle,
        eventType: state.eventType,
        eventDate: state.eventDate,
        eventStartTime: state.eventStartTime,
        eventEndTime: state.eventEndTime,
        rooms: state.rooms,
        roomStyle: state.roomStyle,
        table: state.table,
        chair: state.chair,
        equipments: state.equipments,
        drinks: state.drinks,
        additionalNote: state.additionalNote,
      }
      generateContract(data)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
  async generateQuotation({ state, getters, rootState }) {
    try {
      const response = await this.$axios.$get('/users', {
        headers: {
          common: {
            Authorization: `Bearer ${rootState.user.auth.token}`,
          },
        },
      })
      const customer = response.customer
      const data = {
        customer,
        eventTitle: state.eventTitle,
        eventDate: state.eventDate,
        eventStartTime: state.eventStartTime,
        eventEndTime: state.eventEndTime,
        rooms: state.rooms,
        equipments: state.equipments,
        drinks: state.drinks,
        total: getters.total,
        roomSubtotal: getters.roomSubtotal,
        drinkSubtotal: getters.drinkSubtotal,
        deposit: getters.deposit,
      }
      generateQuotation(data)
    } catch (error) {
      const message = error.response?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ: ${message}`,
        color: 'error',
      })
    }
  },
}
