<script>
import randomColor from '@/utils/colors'

export default {
  layout: 'admin',
  data() {
    return {
      title: 'ໜ້າຫຼັກ',
      barChartData: {
        labels: ['ເຄື່ອງດື່ມ'],
        datasets: [
          {
            label: 'Americano',
            backgroundColor: '#2196F3',
            data: [50],
          },
          {
            label: 'Latte',
            backgroundColor: '#4CAF50',
            data: [60],
          },
          {
            label: 'Mocha',
            backgroundColor: '#F44336',
            data: [75],
          },
        ],
      },
      drinksChartOptions: {
        title: {
          display: true,
          fontSize: 24,
          fontFamily: 'Defago Noto Sans',
          text: 'ແຜນພາບຍອດຂາຍເຄື່ອງດື່ມ',
        },
        responsive: true,
        layout: {
          padding: 10,
        },
        legend: {
          labels: {
            fontFamily: 'Defago Noto Sans',
          },
        },
        tooltips: {
          bodyFontFamily: 'Defago Noto Sans',
          callbacks: {
            label: (tooltips, data) => {
              return `${data.datasets[0].data[tooltips.index]} ຈອກ`
            },
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
      },
      roomsChartOptions: {
        title: {
          display: true,
          fontSize: 24,
          fontFamily: 'Defago Noto Sans',
          text: 'ແຜນພາບຍອດຈອງຫ້ອງ',
        },
        responsive: true,
        layout: {
          padding: 10,
        },
        legend: {
          labels: {
            fontFamily: 'Defago Noto Sans',
          },
        },
        tooltips: {
          bodyFontFamily: 'Defago Noto Sans',
          callbacks: {
            label: (tooltips, data) => {
              return `${data.datasets[0].data[tooltips.index]} ຄັ້ງ`
            },
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
      },
      statusRatioOptions: {
        title: {
          display: true,
          fontSize: 24,
          fontFamily: 'Defago Noto Sans',
          text: 'ສັດສ່ວນສະຖານະການຈອງ',
        },
        legend: {
          labels: {
            fontFamily: 'Defago Noto Sans',
          },
        },
        tooltips: {
          bodyFontFamily: 'Defago Noto Sans',
        },
        responsive: true,
        layout: {
          padding: 10,
        },
      },
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    summaryData() {
      return this.$store.state.admin.dashboard.summary
    },
    drinksData() {
      const data = this.$store.state.admin.dashboard.drinks
      return {
        datasets: data.map((item) => ({
          label: item.name,
          data: [item.sellCount],
          backgroundColor: randomColor(),
        })),
      }
    },
    roomsData() {
      const data = this.$store.state.admin.dashboard.rooms
      return {
        datasets: data.map((item) => ({
          label: item.name,
          data: [item.bookingCount],
          backgroundColor: randomColor(),
        })),
      }
    },
    statusRatioData() {
      const data = this.$store.state.admin.dashboard.statusRatio
      return {
        labels: data.map((item) => item.name),
        datasets: [
          {
            data: data.map((item) => item.count),
            backgroundColor: data.map(() => randomColor()),
          },
        ],
      }
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/dashboard/getDashboardData')
  },
}
</script>
<template>
  <v-container>
    <v-row justify="start" align="start">
      <v-col cols="12" sm="12" md="4">
        <v-card>
          <v-card-title>{{ summaryData.bookingCount }} ຄັ້ງ</v-card-title>
          <v-card-text>
            <p>ຍອດຈອງຫ້ອງ</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-card>
          <v-card-title
            >{{
              summaryData.totalIncome | numFormat('0,0[.]00')
            }}
            ກີບ</v-card-title
          >
          <v-card-text>
            <p>ລາຍຮັບໂດຍລວມ</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-card>
          <v-card-title
            >{{ Math.floor(summaryData.totalHours) }} ຊົ່ວໂມງ</v-card-title
          >
          <v-card-text>
            <p>ຍອດລວມຊົ່ວໂມງເຊົ່າຫ້ອງ</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="start" align="start">
      <v-col sm="12" md="6">
        <v-card>
          <bar-chart
            :chart-data="drinksData"
            :chart-options="drinksChartOptions"
          />
        </v-card>
      </v-col>
      <v-col sm="12" md="6">
        <v-card>
          <bar-chart
            :chart-data="roomsData"
            :chart-options="roomsChartOptions"
          />
        </v-card>
      </v-col>
      <v-col sm="12" md="6">
        <v-card>
          <donut-chart
            :chart-data="statusRatioData"
            :chart-options="statusRatioOptions"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
