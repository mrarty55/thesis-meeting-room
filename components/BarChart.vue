<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    chartOptions: {
      type: Object,
      default: null,
    },
  },
  computed: {
    data() {
      return this.chartData
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.chartOptions)
    },
  },
  mounted() {
    this.renderChart(this.data, this.chartOptions)
  },
}
</script>
