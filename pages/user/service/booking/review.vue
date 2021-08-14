<script>
export default {
  layout: 'user',
  data() {
    return {
      title: 'ກວດສອບຂໍ້ມູນ',
      isLoading: false,
      booking: [
        {
          title: 'ຫົວຂໍ້ງານ',
          value: this.$store.state.user.booking.eventTitle,
          type: 'string',
        },
        {
          title: 'ປະເພດງານ',
          value: this.$store.state.user.booking.eventType.name,
          type: 'string',
        },
        {
          title: 'ຄໍາອະທິບາຍກ່ຽວກັບງານ',
          value: this.$store.state.user.booking.eventDescription,
          type: 'string',
        },
        {
          title: 'ຮູບແບບງານ',
          value: this.$store.state.user.booking.eventStatus.name,
          type: 'string',
        },
        {
          title: 'ວັນທີຈັດງານ',
          value: this.$dateFns.format(
            this.$store.state.user.booking.eventDate,
            'dd/MM/yyyy'
          ),
          type: 'date',
        },
        {
          title: 'ເວລາເລີ່ມຕົ້ນ',
          value: this.$store.state.user.booking.eventStartTime,
          type: 'time',
        },
        {
          title: 'ເວລາສິ້ນສຸດ',
          value: this.$store.state.user.booking.eventEndTime,
          type: 'time',
        },
        {
          title: 'ຫ້ອງທີ່ໃຊ້ຈັດງານ',
          value: this.$store.getters['user/booking/roomsText'],
          type: 'string',
        },
        {
          title: 'ອຸປະກອນຮັບໃຊ້ການຈັດງານ',
          value: this.$store.getters['user/booking/equipmentsText'],
          type: 'string',
        },
        {
          title: 'ເຄື່ອງດື່ມພາຍໃນງານ',
          value: this.$store.getters['user/booking/drinksText'],
          type: 'string',
        },
        {
          title: 'ຮູບແບບການຈັດຫ້ອງ',
          value: this.$store.state.user.booking.roomStyle.name,
          type: 'string',
        },
        {
          title: 'ຈໍານວນໂຕະ',
          value: this.$store.state.user.booking.table,
          type: 'number',
        },
        {
          title: 'ຈໍານວນຕັ່ງ',
          value: this.$store.state.user.booking.chair,
          type: 'number',
        },
        {
          title: 'ຂໍ້ຄວາມເສີມ',
          value: this.$store.state.user.booking.additionalNote,
          type: 'string',
        },
        {
          title: 'ລວມມູນຄ່າການເຊົ່າຫ້ອງ',
          value: this.$store.getters['user/booking/roomSubtotal'],
          type: 'currency',
        },
        {
          title: 'ລວມມູນຄ່າເຄື່ອງດື່ມ',
          value: this.$store.getters['user/booking/drinkSubtotal'],
          type: 'currency',
        },
        {
          title: 'ລວມມູນຄ່າທັງໝົດ',
          value: this.$store.getters['user/booking/total'],
          type: 'currency',
        },
        {
          title: 'ຄ່າມັດຈໍາທີ່ຕ້ອງຈ່າຍກ່ອນ',
          value: this.$store.getters['user/booking/deposit'],
          type: 'currency',
        },
      ],
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    loading() {
      return this.$store.state.user.booking.loading
    },
    errorMessage() {
      return this.$store.state.user.booking.errorMessage
    },
  },
  methods: {
    onSubmit() {
      this.$store.dispatch('user/booking/uploadBookingData')
    },
    onBack() {
      this.$router.back()
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
            <v-simple-table>
              <template #default>
                <tbody>
                  <tr v-for="item of booking" :key="item.title">
                    <th>
                      {{ item.title }}
                    </th>
                    <td v-if="item.type === 'currency'">
                      {{ item.value | numFormat('0,0[.]00') }} ກີບ
                    </td>
                    <td v-else>{{ item.value || '-' }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <p v-if="errorMessage" class="red--text">{{ errorMessage }}</p>
            <v-card-actions>
              <v-btn
                color="primary"
                :disabled="isLoading"
                :loading="loading"
                @click="onSubmit"
                >ຕົກລົງ</v-btn
              >
              <v-btn text color="error" :disabled="isLoading" @click="onBack"
                >ກັບຄືນ</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
