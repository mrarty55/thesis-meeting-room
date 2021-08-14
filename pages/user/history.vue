<script>
export default {
  layout: 'user',
  middleware: 'user-auth',
  data() {
    return {
      title: 'ປະຫວັດການຈອງ',
      bookingTableHeaders: [
        {
          text: 'ລໍາດັບ',
          value: 'no',
          sortable: false,
        },
        {
          text: 'ຊື່ຫົວຂໍ້ງານ',
          value: 'eventTitle',
        },
        {
          text: 'ວັນທີຈັດງານ',
          value: 'eventDate',
        },
        {
          text: 'ເວລາເລີ່ມຕົ້ນ',
          value: 'eventStartTime',
        },
        {
          text: 'ເວລາສິ້ນສຸດ',
          value: 'eventEndTime',
        },
        {
          text: 'ສະຖານະການຈອງ',
          value: 'bookingStatus.name',
        },
      ],
      footerProps: {
        'items-per-page-text': 'ຈໍານວນລາຍການ',
        'items-per-page-all-text': 'ທັງໝົດ',
      },
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    history() {
      return this.$store.state.user.history.bookings
    },
  },
  mounted() {
    this.$store.dispatch('user/history/getBookingHistory')
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card>
          <v-data-table
            :items="history"
            :headers="bookingTableHeaders"
            :footer-props="footerProps"
            no-data-text="ບໍ່ມີຂໍ້ມູນ"
          >
            <template #top>
              <v-card-title>ປະຫວັດການຈອງຫ້ອງປະຊຸມ</v-card-title>
            </template>
            <template #[`item.no`]="props">
              <span>{{ props.index + 1 }}</span>
            </template>
            <template #[`item.eventDate`]="props">
              <span>{{
                $dateFns.format(props.item.eventDate, 'dd/MM/yyyy')
              }}</span>
            </template>
            <template #[`item.eventStartTime`]="props">
              <span>{{ props.item.eventStartTime.substring(0, 5) }}</span>
            </template>
            <template #[`item.eventEndTime`]="props">
              <span>{{ props.item.eventEndTime.substring(0, 5) }}</span>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
