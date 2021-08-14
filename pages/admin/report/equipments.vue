<script>
import { mdiFileExport } from '@mdi/js'
import { generateEquipmentReport } from '~/utils/pdf'
export default {
  layout: 'admin',
  data() {
    return {
      title: 'ລາຍງານອຸປະກອນ',
      equipmentsTableHeaders: [
        {
          text: 'ລໍາດັບ',
          value: 'no',
          sortable: false,
        },
        {
          text: 'ຊື່ອຸປະກອນ',
          value: 'name',
        },
        {
          text: 'ຍອດການນຳໃຊ້',
          value: 'bookingCount',
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
    equipments() {
      return this.$store.state.admin.report.equipments.equipments
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/report/equipments/getEquipmentReport')
  },
  methods: {
    onExportAsPdf() {
      generateEquipmentReport(this.equipments)
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
              :items="equipments"
              :headers="equipmentsTableHeaders"
              :footer-props="footerProps"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-card-title class="justify-space-between">
                  <span>ຂໍ້ມູນອຸປະກອນ</span>
                  <v-btn outlined color="info" @click="onExportAsPdf">
                    <v-icon left>{{ icons.exportIcon }}</v-icon>
                    <span>ສົ່ງອອກເປັນ PDF</span>
                  </v-btn>
                </v-card-title>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.bookingCount`]="props">
                <span>{{ props.item.bookingCount }}</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
