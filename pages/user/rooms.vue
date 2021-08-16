<script>
import { mdiChevronLeft, mdiChevronRight, mdiImageOff } from '@mdi/js'
export default {
  layout: 'user',
  middleware: 'user-auth',
  data() {
    return {
      title: 'ຄົ້ນຫາຫ້ອງ',
      calendarModel: '',
      calendarType: 'month',
      calendarTypes: [
        {
          text: 'ເດືອນ',
          value: 'month',
        },
        {
          text: 'ທິດ',
          value: 'week',
        },
      ],
      icons: {
        leftIcon: mdiChevronLeft,
        rightIcon: mdiChevronRight,
        noImageIcon: mdiImageOff,
      },
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    bookingSchedule() {
      return this.$store.state.user.rooms.schedule
    },
    availableRooms() {
      return this.$store.state.user.rooms.rooms
    },
  },
  mounted() {
    this.$store.dispatch('user/rooms/getBookingSchedule')
    this.$store.dispatch('user/rooms/getAvailableRooms')
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-sheet>
          <h2>ລາຍການຫ້ອງ</h2>
        </v-sheet>
      </v-col>
      <v-col
        v-for="room of availableRooms"
        :key="room.id"
        cols="12"
        sm="12"
        md="4"
      >
        <v-card>
          <v-img
            v-if="room.image"
            :src="room.image"
            :alt="room.name"
            max-height="128"
          ></v-img>
          <v-icon v-else size="128">{{ icons.noImageIcon }}</v-icon>
          <v-card-title>{{ room.name }}</v-card-title>
          <v-card-text>
            <p>
              ອັດຕາຄ່າເຊົ່າຕໍ່ຊົ່ວໂມງ:
              {{ room.hourlyRate | numFormat('0,0[.]00') }} ກີບ
            </p>
            <p>
              ອັດຕາຄ່າເຊົ່າຕໍ່ຄາບ (4ຊົ່ວໂມງ):
              {{ room.shiftRate | numFormat('0,0[.]00') }} ກີບ
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title class="justify-space-between">
            <v-btn icon @click="$refs.calendar.prev()">
              <v-icon>{{ icons.leftIcon }}</v-icon>
            </v-btn>
            <span class="d-inline-flex">
              <v-select
                v-model="calendarType"
                label="ຮູບແບບປະຕິທິນ"
                :items="calendarTypes"
                class="mx-4 shrink"
              ></v-select>
            </span>
            <span v-if="$refs.calendar">
              {{ `ປະຕິທິນວັນເວລາການຈອງເດືອນ${$refs.calendar.title}` }}
            </span>
            <span v-else>ປະຕິທິນວັນເວລາການຈອງ</span>
            <v-btn icon @click="$refs.calendar.next()">
              <v-icon>{{ icons.rightIcon }}</v-icon>
            </v-btn>
          </v-card-title>
          <v-calendar
            ref="calendar"
            v-model="calendarModel"
            :events="bookingSchedule"
            :short-intervals="false"
            :type="calendarType"
            locale="lo-LA"
          >
          </v-calendar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
