<script>
import { required, integer, minValue } from 'vuelidate/lib/validators'
import minimumDate from '@/utils/date'

export default {
  layout: 'user',
  data() {
    return {
      title: 'ປ້ອນຂໍ້ມູນໃບສະເໜີລາຄາ',
      eventDateDialog: false,
      eventStartTimeDialog: false,
      eventEndTimeDialog: false,
      drinksTableHeaders: [
        {
          text: 'ຊື່',
          sortable: false,
          value: 'name',
        },
        {
          text: 'ລາຄາຕໍ່ໜ່ວຍ',
          sortable: false,
          value: 'price',
        },
        {
          text: 'ຈໍານວນ',
          sortable: false,
          value: 'amount',
        },
      ],
      roomsData: [],
      equipmentsData: [],
      drinksData: [],
    }
  },
  validations: {
    eventTitle: { required },
    eventDate: { required },
    eventStartTime: { required },
    eventEndTime: { required },
    rooms: { required },
    drinks: {
      $each: {
        amount: { integer, minValue: minValue(0) },
      },
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    eventTitle: {
      get() {
        return this.$store.state.user.quotation.eventTitle
      },
      set(value) {
        this.$store.commit('user/quotation/title', value)
      },
    },
    eventType: {
      get() {
        return this.$store.state.user.quotation.eventType
      },
      set(value) {
        this.$store.commit('user/quotation/type', value)
      },
    },
    eventStatus: {
      get() {
        return this.$store.state.user.quotation.eventStatus
      },
      set(value) {
        this.$store.commit('user/quotation/status', value)
      },
    },
    eventDate: {
      get() {
        return this.$store.state.user.quotation.eventDate
      },
      set(value) {
        this.$store.commit('user/quotation/date', value)
      },
    },
    eventStartTime: {
      get() {
        return this.$store.state.user.quotation.eventStartTime
      },
      set(value) {
        this.$store.commit('user/quotation/start', value)
      },
    },
    eventEndTime: {
      get() {
        return this.$store.state.user.quotation.eventEndTime
      },
      set(value) {
        this.$store.commit('user/quotation/end', value)
      },
    },
    rooms: {
      get() {
        return this.$store.state.user.quotation.rooms
      },
      set(value) {
        this.$store.commit('user/quotation/rooms', value)
      },
    },
    roomStyle: {
      get() {
        return this.$store.state.user.quotation.roomStyle
      },
      set(value) {
        this.$store.commit('user/quotation/style', value)
      },
    },
    equipments: {
      get() {
        return this.$store.state.user.quotation.equipments
      },
      set(value) {
        this.$store.commit('user/quotation/equipments', value)
      },
    },
    drinks: {
      get() {
        return this.$store.state.user.quotation.drinks
      },
      set(value) {
        this.$store.commit('user/quotation/drinks', value)
      },
    },
    eventTitleErrors() {
      const errors = []
      if (!this.$v.eventTitle.$dirty) return errors
      !this.$v.eventTitle.required && errors.push('ກະລຸນາປ້ອນຫົວຂໍ້ງານ')
      return errors
    },
    eventTypeErrors() {
      const errors = []
      if (!this.$v.eventType.$dirty) return errors
      !this.$v.eventType.required && errors.push('ກະລຸນາເລືອກປະເພດງານ')
      return errors
    },
    eventStatusErrors() {
      const errors = []
      if (!this.$v.eventStatus.$dirty) return errors
      !this.$v.eventStatus.required && errors.push('ກະລຸນາເລືອກຮູບແບບງານ')
      return errors
    },
    eventDateErrors() {
      const errors = []
      if (!this.$v.eventDate.$dirty) return errors
      !this.$v.eventDate.required && errors.push('ກະລຸນາປ້ອນວັນທີຈັດງານ')
      return errors
    },
    eventStartTimeErrors() {
      const errors = []
      if (!this.$v.eventStartTime.$dirty) return errors
      !this.$v.eventStartTime.required && errors.push('ກະລຸນາປ້ອນເວລາເລີ່ມຕົ້ນ')
      return errors
    },
    eventEndTimeErrors() {
      const errors = []
      if (!this.$v.eventEndTime.$dirty) return errors
      !this.$v.eventEndTime.required && errors.push('ກະລຸນາປ້ອນເວລາສິ້ນສຸດ')
      return errors
    },
    roomsErrors() {
      const errors = []
      if (!this.$v.rooms.$dirty) return errors
      !this.$v.rooms.required && errors.push('ກະລຸນາເລືອກຫ້ອງ')
      return errors
    },
    roomStyleErrors() {
      const errors = []
      if (!this.$v.roomStyle.$dirty) return errors
      !this.$v.roomStyle.required && errors.push('ກະລຸນາເລືອກຮູບແບບການຈັດຫ້ອງ')
      return errors
    },
    minDate() {
      return minimumDate()
    },
    loading() {
      return this.$store.state.user.quotation.loading
    },
    errorMessage() {
      return this.$store.state.user.quotation.errorMessage
    },
  },
  async mounted() {
    try {
      const response = await this.$axios.$get('/bookings/data/form', {
        headers: {
          common: {
            Authorization: `Bearer ${this.$store.state.user.auth.token}`,
          },
        },
      })
      this.roomsData = response.rooms
      this.equipmentsData = response.equipments
      this.drinksData = response.drinks
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
  methods: {
    onReview() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.$store.dispatch('user/quotation/review')
    },
    onClear() {
      this.$v.$reset()
      this.$store.commit('user/quotation/clear')
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col sm="12" md="9">
        <v-card>
          <v-card-title class="justify-center">
            <h3>{{ title }}</h3>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onReview">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="eventTitle"
                    label="ຫົວຂໍ້ງານ"
                    placeholder="Google I/O 2021 Extended"
                    :error-messages="eventTitleErrors"
                  ></v-text-field>
                </v-col>
                <v-col sm="12" md="4">
                  <v-menu
                    ref="eventDateDialog"
                    v-model="eventDateDialog"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    :return-value.sync="eventDate"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="eventDate"
                        label="ວັນທີຈັດງານ"
                        readonly
                        v-bind="attrs"
                        :error-messages="eventDateErrors"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="eventDate"
                      locale="lo-LA"
                      :min="minDate"
                    >
                      <v-spacer />
                      <v-btn
                        color="primary"
                        @click="$refs.eventDateDialog.save(eventDate)"
                        >ຕົກລົງ</v-btn
                      >
                      <v-btn color="error" @click="eventDateDialog = false"
                        >ຍົກເລີກ</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col sm="12" md="4">
                  <v-menu
                    ref="eventStartTimeDialog"
                    v-model="eventStartTimeDialog"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    :return-value.sync="eventStartTime"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="eventStartTime"
                        label="ເວລາເລີ່ມຕົ້ນ"
                        readonly
                        v-bind="attrs"
                        :error-messages="eventStartTimeErrors"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="eventStartTime"
                      min="08:00"
                      :max="eventEndTime"
                      locale="lo-LA"
                    >
                      <v-spacer />
                      <v-btn
                        color="primary"
                        @click="$refs.eventStartTimeDialog.save(eventStartTime)"
                        >ຕົກລົງ</v-btn
                      >
                      <v-btn color="error" @click="eventStartTimeDialog = false"
                        >ຍົກເລີກ</v-btn
                      >
                    </v-time-picker>
                  </v-menu>
                </v-col>
                <v-col sm="12" md="4">
                  <v-menu
                    ref="eventEndTimeDialog"
                    v-model="eventEndTimeDialog"
                    transition="scale-transition"
                    :close-on-content-click="false"
                    :return-value.sync="eventEndTime"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="eventEndTime"
                        label="ເວລາສິ້ນສຸດ"
                        readonly
                        v-bind="attrs"
                        :error-messages="eventStartTimeErrors"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="eventEndTime"
                      :min="eventStartTime"
                      max="18:00"
                      locale="lo-LA"
                    >
                      <v-spacer />
                      <v-btn
                        color="primary"
                        @click="$refs.eventEndTimeDialog.save(eventEndTime)"
                        >ຕົກລົງ</v-btn
                      >
                      <v-btn color="error" @click="eventEndTimeDialog = false"
                        >ຍົກເລີກ</v-btn
                      >
                    </v-time-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-container>
                    <p>ຫ້ອງທີ່ໃຊ້ຈັດງານ</p>
                    <v-row>
                      <v-col>
                        <v-autocomplete
                          v-model="rooms"
                          label="ເລືອກຫ້ອງທີ່ຕ້ອງການ"
                          :items="roomsData"
                          item-text="name"
                          multiple
                          return-object
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col cols="12">
                  <v-container>
                    <p>ອຸປະກອນຮັບໃຊ້ການຈັດງານ</p>
                    <v-row>
                      <v-col>
                        <v-autocomplete
                          v-model="equipments"
                          label="ເລືອກອຸປະກອນທີ່ຕ້ອງການ"
                          :items="equipmentsData"
                          item-text="name"
                          multiple
                          return-object
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col cols="12">
                  <v-container>
                    <p>ເຄື່ອງດື່ມພາຍໃນງານ</p>
                    <v-row>
                      <v-col>
                        <v-autocomplete
                          v-model="drinks"
                          label="ເລືອກເຄື່ອງດື່ມທີ່ຕ້ອງການ"
                          :items="drinksData"
                          item-text="name"
                          multiple
                          return-object
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col>
                  <v-data-table
                    :headers="drinksTableHeaders"
                    :items="drinks"
                    :hide-default-footer="true"
                    no-data-text="ບໍ່ມີເຄື່ອງດື່ມທີ່ເລືອກ"
                  >
                    <template #top>
                      <v-row align="center" class="px-6">
                        <p>ລາຍການເຄື່ອງດື່ມທີ່ເລືອກ</p>
                      </v-row>
                    </template>
                    <template #[`item.price`]="props">
                      <span
                        >{{
                          props.item.price | numFormat('0,0[.]00')
                        }}
                        ກີບ</span
                      >
                    </template>
                    <template #[`item.amount`]="props">
                      <v-text-field
                        v-model="props.item.amount"
                        type="number"
                        label="ຈໍານວນ"
                      ></v-text-field>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="12">
                  <p v-if="errorMessage" class="red--text">
                    {{ errorMessage }}
                  </p>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="$v.$invalid"
                  :loading="loading"
                  >ຖັດໄປ</v-btn
                >
                <v-btn
                  text
                  type="reset"
                  color="error"
                  :disabled="loading"
                  @click="onClear"
                  >ລຶບ</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
