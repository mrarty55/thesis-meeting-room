<script>
import { mdiFileExport } from '@mdi/js'
import { generateBookingReport } from '~/utils/pdf'
export default {
  layout: 'admin',
  data() {
    return {
      title: 'ລາຍງານການຈອງ',
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
          text: 'ປະເພດງານ',
          value: 'eventType',
        },
        {
          text: 'ຮູບແບບງານ',
          value: 'eventStatus',
        },
        {
          text: 'ວັນທີຈັດງານ',
          value: 'eventDate',
        },
        {
          text: 'ວັນເວລາຈອງ',
          value: 'createdAt',
        },
      ],
      footerProps: {
        'items-per-page-text': 'ຈໍານວນລາຍການ',
        'items-per-page-all-text': 'ທັງໝົດ',
      },
      icons: {
        exportIcon: mdiFileExport,
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
      return this.$store.state.admin.report.booking.bookings
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/report/booking/getBookingReport')
  },
  methods: {
    onExportAsPdf() {
      generateBookingReport(this.bookings)
    },
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
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-card-title class="justify-space-between">
                  <span>ຂໍ້ມູນການຈອງ</span>
                  <v-btn outlined color="info" @click="onExportAsPdf">
                    <v-icon left>{{ icons.exportIcon }}</v-icon>
                    <span>ສົ່ງອອກເປັນ PDF</span>
                  </v-btn>
                </v-card-title>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.eventDate`]="props">
                <span>{{
                  $dateFns.format(props.item.eventDate, 'dd/MM/yyyy')
                }}</span>
              </template>
              <template #[`item.createdAt`]="props">
                <span>{{
                  $dateFns.format(props.item.createdAt, 'dd/MM/yyyy HH:mm:ss')
                }}</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
