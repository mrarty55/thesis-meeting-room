<script>
import { mdiFileExport } from '@mdi/js'
import { generateRevenueReport } from '~/utils/pdf'
export default {
  layout: 'admin',
  data() {
    return {
      title: 'ລາຍງານລາຍຮັບ',
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
    revenue() {
      return this.$store.state.admin.report.revenue.revenue
    },
    overall() {
      return (item) => item.overall || 0
    },
    confirmed() {
      return (item) => item.confirmed || 0
    },
    checkedin() {
      return (item) => item.checkedin || 0
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/report/revenue/getRevenueReport')
  },
  methods: {
    onExportAsPdf() {
      generateRevenueReport(this.revenue)
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card>
          <v-card-title class="justify-space-between">
            <span>ຂໍ້ມູນລາຍຮັບ</span>
            <v-btn outlined color="info" @click="onExportAsPdf">
              <v-icon left>{{ icons.exportIcon }}</v-icon>
              <span>ສົ່ງອອກເປັນ PDF</span>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>
                    <h2>ໂດຍລວມ</h2>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>ລວມທັງໝົດ</th>
                  <td>
                    {{ overall(revenue).total || '-' | numFormat('0,0[.]00') }}
                    ກີບ
                  </td>
                </tr>
                <tr>
                  <th>ມູນຄ່າການຈອງຫ້ອງ</th>
                  <td>
                    {{
                      overall(revenue).roomSubtotal ||
                      '-' | numFormat('0,0[.]00')
                    }}
                    ກີບ
                  </td>
                </tr>
                <tr>
                  <th>ມູນຄ່າເຄື່ອງດື່ມ</th>
                  <td>
                    {{
                      overall(revenue).drinkSubtotal ||
                      '-' | numFormat('0,0[.]00')
                    }}
                    ກີບ
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>
                    <h2>ສະເພາະການຈອງທີ່ໄດ້ຮັບການຢືນຢັນ</h2>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>ລວມທັງໝົດ</th>
                  <td>
                    {{
                      confirmed(revenue).total || '-' | numFormat('0,0[.]00')
                    }}
                    ກີບ
                  </td>
                </tr>
                <tr>
                  <th>ມູນຄ່າການຈອງຫ້ອງ</th>
                  <td>
                    {{
                      confirmed(revenue).roomSubtotal ||
                      '-' | numFormat('0,0[.]00')
                    }}
                    ກີບ
                  </td>
                </tr>
                <tr>
                  <th>ມູນຄ່າເຄື່ອງດື່ມ</th>
                  <td>
                    {{
                      confirmed(revenue).drinkSubtotal ||
                      '-' | numFormat('0,0[.]00')
                    }}
                    ກີບ
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>
                    <h2>ໄດ້ຮັບຕົວຈິງ</h2>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>ລວມທັງໝົດ</th>
                  <td>
                    {{
                      checkedin(revenue).total || '-' | numFormat('0,0[.]00')
                    }}
                    ກີບ
                  </td>
                </tr>
                <tr>
                  <th>ມູນຄ່າການຈອງຫ້ອງ</th>
                  <td>
                    {{
                      checkedin(revenue).roomSubtotal ||
                      '-' | numFormat('0,0[.]00')
                    }}
                    ກີບ
                  </td>
                </tr>
                <tr>
                  <th>ມູນຄ່າເຄື່ອງດື່ມ</th>
                  <td>
                    {{
                      checkedin(revenue).drinkSubtotal ||
                      '-' | numFormat('0,0[.]00')
                    }}
                    ກີບ
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
