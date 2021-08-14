<script>
import { mdiFileExport } from '@mdi/js'
import { generateDrinkReport } from '~/utils/pdf'
export default {
  layout: 'admin',
  data() {
    return {
      title: 'ລາຍງານເຄື່ອງດື່ມ',
      drinksTableHeaders: [
        {
          text: 'ລໍາດັບ',
          value: 'no',
          sortable: false,
        },
        {
          text: 'ຊື່',
          value: 'name',
        },
        {
          text: 'ຍອດຂາຍ',
          value: 'sellCount',
        },
        {
          text: 'ລວມມູນຄ່າ',
          value: 'sellTotal',
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
    drinks() {
      return this.$store.state.admin.report.drinks.drinks
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/report/drinks/getDrinkReport')
  },
  methods: {
    onExportAsPdf() {
      generateDrinkReport(this.drinks)
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
              :items="drinks"
              :headers="drinksTableHeaders"
              :footer-props="footerProps"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-card-title class="justify-space-between">
                  <span>ຂໍ້ມູນເຄື່ອງດື່ມ</span>
                  <v-btn outlined color="info" @click="onExportAsPdf">
                    <v-icon left>{{ icons.exportIcon }}</v-icon>
                    <span>ສົ່ງອອກເປັນ PDF</span>
                  </v-btn>
                </v-card-title>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.sellCount`]="props">
                <span>{{ props.item.sellCount || 0 }} ຈອກ</span>
              </template>
              <template #[`item.sellTotal`]="props">
                <span
                  >{{ props.item.sellTotal | numFormat('0,0[.]00') }} ກີບ</span
                >
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
