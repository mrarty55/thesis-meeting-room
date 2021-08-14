<script>
export default {
  layout: 'user',
  data() {
    return {
      title: 'ສໍາເລັດ',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  methods: {
    onPrintQuatation() {
      this.$store.dispatch('user/quotation/generateQuotation')
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col sm="12" md="9">
        <v-card>
          <v-card-title class="justify-center">
            <h3>{{ title }}</h3>
          </v-card-title>
          <v-card-text>
            <p>ຂັ້ນຕອນການອອກໃບສະເໜີລາຄາແມ່ນໄດ້ສໍາເລັດແລ້ວ!</p>
            <p>ທ່ານສາມາດຮັບເອົາໃບສະເໜີລາຄາໄດ້ທີ່ເມນູດ້ານລຸ່ມນີ້:</p>
            <v-card-actions>
              <v-btn color="primary" @click="onPrintQuatation"
                >ພິມໃບສະເໜິີລາຄາ</v-btn
              >
              <v-btn text color="primary" to="/user/service" exact
                >ກັບໄປທີ່ເມນູຫຼັກ</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
