<script>
import { mdiMagnify } from '@mdi/js'
export default {
  layout: 'admin',
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
        // {
        //   text: 'ຕົວເລືອກ',
        //   value: 'actions',
        //   sortable: false,
        // },
      ],
      footerProps: {
        'items-per-page-text': 'ຈໍານວນລາຍການ',
        'items-per-page-all-text': 'ທັງໝົດ',
      },
      searchBooking: '',
      icons: {
        magnifyIcon: mdiMagnify,
      },
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    bookings() {
      return this.$store.state.admin.service.bookingHistory.bookings
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/service/bookingHistory/getBookings')
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-data-table
              :items="bookings"
              :headers="bookingTableHeaders"
              :footer-props="footerProps"
              :search="searchBooking"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-row align="center" class="px-2">
                  <v-card-title>ປະຫວັດການຈອງ</v-card-title>
                  <v-text-field
                    v-model="searchBooking"
                    label="ຄົ້ນຫາ"
                    :prepend-inner-icon="icons.magnifyIcon"
                    class="shrink"
                  ></v-text-field>
                </v-row>
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
              <template #[`item.actions`]="">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn color="info" icon v-bind="attrs" v-on="on">
                      <v-icon>{{ icons.detailsIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>ລາຍລະອຽດ</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
