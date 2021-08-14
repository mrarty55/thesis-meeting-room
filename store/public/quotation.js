import minimumDate from '@/utils/date'
import { generateQuotation } from '@/utils/pdf'

export const state = () => ({
  name: '',
  email: '',
  phoneNumber: '',
  occupation: '',
  eventTitle: '',
  eventDate: minimumDate(),
  eventStartTime: '8:00',
  eventEndTime: '12:00',
  rooms: [],
  equipments: [],
  drinks: [],
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
  name(state, payload) {
    state.name = payload
  },
  email(state, payload) {
    state.email = payload
  },
  phoneNumber(state, payload) {
    state.phoneNumber = payload
  },
  occupation(state, payload) {
    state.occupation = payload
  },
  title(state, payload) {
    state.eventTitle = payload
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
  deposit(state, payload) {
    state.depositStatement = payload
  },
  clear(state) {
    state.eventTitle = ''
    state.eventDate = minimumDate()
    state.eventStartTime = '8:00'
    state.eventEndTime = '12:00'
    state.rooms = []
    state.equipments = []
    state.drinks = []
  },
  loading(state, payload) {
    state.loading = payload
  },
  error(state, payload) {
    state.errorMessage = payload
  },
}

export const actions = {
  review({ commit }) {
    commit('loading', true)
    this.$router.push('/public/quotation/review')
    commit('loading', false)
  },
  generateQuotation({ state, getters }) {
    try {
      const customer = {
        name: state.name,
        email: state.email,
        phoneNumber: state.phoneNumber,
        occupation: state.occupation,
      }
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
