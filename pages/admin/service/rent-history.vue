<script>
export default {
  layout: 'admin',
  data() {
    return {
      title: 'ປະຫວັດການແຈ້ງເຂົ້າ',
      rentsTableHeaders: [
        {
          text: 'ລໍາດັບ',
          value: 'no',
          sortable: false,
        },
        {
          text: 'ລະຫັດການຈອງ',
          value: 'booking.id',
        },
        {
          text: 'ຫົວຂໍ້ງານ',
          value: 'booking.eventTitle',
        },
        {
          text: 'ວັນທີຈັດງານ',
          value: 'booking.eventDate',
        },
        {
          text: 'ເວລາແຈ້ງເຂົ້າ',
          value: 'checkinAt',
        },
        {
          text: 'ຜູ້ຮັບຜິດຊອບ',
          value: 'staff',
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
    rents() {
      return this.$store.state.admin.service.rentHistory.rents
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/service/rentHistory/getRents')
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
              :items="rents"
              :headers="rentsTableHeaders"
              :footer-props="footerProps"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-row align="center">
                  <v-card-title>ປະຫວັດການແຈ້ງເຂົ້າ</v-card-title>
                </v-row>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.booking.id`]="props">
                <span>B{{ props.item.booking.id | numFormat('000') }}</span>
              </template>
              <template #[`item.booking.eventDate`]="props">
                <span>{{
                  $dateFns.format(props.item.booking.eventDate, 'dd/MM/yyyy')
                }}</span>
              </template>
              <template #[`item.checkinAt`]="props">
                <span>{{
                  $dateFns.format(props.item.checkinAt, 'dd/MM/yyyy HH:mm:ss')
                }}</span>
              </template>
              <template #[`item.staff`]="props">
                <span>{{
                  `${props.item.staff.firstName} ${props.item.staff.lastName}`
                }}</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
