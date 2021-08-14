<script>
export default {
  data() {
    return {
      title: 'ລົງທະບຽນສໍາເລັດ',
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
      <v-col sm="12" md="6">
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <v-card-text>
            <p>
              ທ່ານໄດ້ລົງທະບຽນນໍາໃຊ້ລະບົບບໍລິການຫ້ອງປະຊຸມເປັນທີ່ສໍາເລັດຮຽບຮ້ອຍແລ້ວ.
            </p>
            <v-card-actions>
              <v-btn color="primary" to="/login">ເຂົ້າສູ່ລະບົບ</v-btn>
              <v-btn text color="primary" to="/">ໜ້າຫຼັກ</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
