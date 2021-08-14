<script>
import { mdiFileExport } from '@mdi/js'
import { generateRoomReport } from '~/utils/pdf'
export default {
  layout: 'admin',
  data() {
    return {
      title: 'ລາຍງານຫ້ອງປະຊຸມ',
      roomsTableHeaders: [
        {
          text: 'ລໍາດັບ',
          value: 'no',
          sortable: false,
        },
        {
          text: 'ຊື່ຫ້ອງ',
          value: 'name',
        },
        {
          text: 'ຍອດຈອງ',
          value: 'bookingCount',
        },
        {
          text: 'ລວມຊົ່ວໂມງທີ່ຈອງ',
          value: 'bookingHours',
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
    rooms() {
      return this.$store.state.admin.report.rooms.rooms
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/report/rooms/getRoomReport')
  },
  methods: {
    onExportAsPdf() {
      generateRoomReport(this.rooms)
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
              :items="rooms"
              :headers="roomsTableHeaders"
              :footer-props="footerProps"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-card-title class="justify-space-between">
                  <span>ຂໍ້ມູນຫ້ອງປະຊຸມ</span>
                  <v-btn outlined color="info" @click="onExportAsPdf">
                    <v-icon left>{{ icons.exportIcon }}</v-icon>
                    <span>ສົ່ງອອກເປັນ PDF</span>
                  </v-btn>
                </v-card-title>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.bookingHours`]="props">
                <span
                  >{{ Math.floor(props.item.bookingHours) || 0 }} ຊົ່ວໂມງ</span
                >
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
