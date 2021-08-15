<script>
export default {
  layout: 'user',
  data() {
    return {
      title: 'ຊໍາລະຄ່າມັດຈໍາ',
      file: '',
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    depositStatement: {
      get() {
        return this.$store.state.user.booking.depositStatement
      },
      set(value) {
        this.$store.commit('user/booking/deposit', value)
      },
    },
    loading() {
      return this.$store.state.user.booking.loading
    },
    errorMessage() {
      return this.$store.state.user.booking.errorMessage
    },
  },
  methods: {
    onUpload() {
      this.$store.dispatch('user/booking/uploadDepositStatement')
    },
    onSkip() {
      this.$router.push('/user/service/booking/success')
    },
    async onSelectPicture(file) {
      const form = new FormData()
      form.append('deposit', file)
      try {
        const response = await this.$axios.$post('/bookings/deposit', form, {
          headers: {
            common: {
              Authorization: `Bearer ${this.$store.state.user.auth.token}`,
            },
          },
        })
        this.file = file
        this.$store.commit('user/booking/deposit', response.deposit)
      } catch (error) {
        this.$notifier.showMessage({
          message: 'ມີຂໍ້ຜິດພາດໃນການເລືອກຮູບ',
          color: 'error',
        })
      }
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
            <p>
              ກະລຸນາຊໍາລະຄ່າມັດຈໍາຜ່ານທະນາຄານການຄ້າຕ່າງປະເທດລາວ ຊື່ບັນຊີ
              ວິສາຫະກິດສ່ວນບຸກຄົນຮ້ານປຶ້ມແລະສຳນັກພິມດອກເກດ ບັນຊີເລກທີ
              XXX-XX-XX-XXXXXXXX-XXX
            </p>
            <p>ເມື່ອທ່ານຊໍາລະຄ່າມັດຈໍາແລ້ວໃຫ້ທ່ານອັບໂຫຼດຫຼັກຖານການຊໍາລະ</p>
            <v-file-input
              v-model="file"
              label="ຫຼັກຖານການຊໍາລະເງິນ"
              hint="ຮັບຮອງຮູບເທົ່ານັ້ນ"
              persistent-hint
              @change="onSelectPicture"
            ></v-file-input>
            <p v-if="errorMessage" class="red--text">{{ errorMessage }}</p>
            <v-card-actions>
              <v-btn
                color="primary"
                :disabled="!file"
                :loading="loading"
                @click="onUpload"
                >ອັບໂຫຼດ</v-btn
              >
              <v-btn
                text
                color="primary"
                exact
                :disabled="loading"
                @click="onSkip"
                >ດໍາເນີນການພາຍຫຼັງ</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
