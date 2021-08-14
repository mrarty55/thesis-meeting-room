<script>
export default {
  layout: 'user',
  data() {
    return {
      title: 'ສໍາເລັດການຈອງ',
    }
  },
  head() {
    return {
      title: this.title,
    }
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
            <p>ຂັ້ນຕອນການຈອງຫ້ອງປະຊຸມແມ່ນໄດ້ສໍາເລັດແລ້ວ!</p>
            <p>
              ລະບົບຈະສົ່ງອີເມວແຈ້ງເຕືອນທ່ານເມື່ອການຈອງໄດ້ຮັບການຢືນຢັນເປັນທີ່ຮຽບຮ້ອຍແລ້ວ.
            </p>
            <p>
              ທ່ານສາມາດຮັບເອົາໃບສັນຍາການຈອງ ແລະ
              ໃບສະເໜີລາຄາໄດ້ທີ່ເມນູດ້ານລຸ່ມນີ້:
            </p>
            <v-card-actions>
              <v-btn color="primary">ຮັບສັນຍາການຈອງ</v-btn>
              <v-btn color="primary">ຮັບໃບສະເໜິີລາຄາ</v-btn>
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
