<script>
import { mdiSend } from '@mdi/js'
import { required, email } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      title: 'ລືມລະຫັດຜ່ານ',
      email: '',
      loading: false,
      errorMessage: '',
      icons: {
        sendIcon: mdiSend,
      },
    }
  },
  validations: {
    email: { required, email },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return
      !this.$v.email.required && errors.push('ກະລຸນາປ້ອນທີ່ຢູ່ອີເມວ')
      !this.$v.email.email && errors.push('ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ')
      return errors
    },
  },
  methods: {
    async onSend() {
      this.errorMessage = ''
      this.loading = true
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.loading = false
        return
      }
      try {
        await this.$axios.$post('/admins/reset', { email: this.email })
        this.loading = false
        this.$router.push('/admin/login')
        this.$notifier.showMessage({
          message:
            'ລະບົບໄດ້ສົ່ງເມວສຳລັບຣີເຊັດລະຫັດຜ່ານແລ້ວ! ກະລຸນາກວດສອບກ່ອງອີເມວຂອງທ່ານ',
          color: 'success',
        })
      } catch (error) {
        this.loading = false
        switch (error.response?.status) {
          case 404:
            this.errorMessage = 'ຮູບແບບທີ່ຢູ່ອີເມວບໍ່ຖືກຕ້ອງຫຼືບໍ່ມີໃນລະບົບ'
            break
          default:
            this.errorMessage = 'ມີຂໍ້ຜິດພາດໃນການຮ້ອງຂໍການຣີເຊັດລະຫັດຜ່ານ'
            break
        }
      }
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6" sm="12" md="6">
        <v-card>
          <v-card-title> ລືມລະຫັດຜ່ານ? </v-card-title>
          <v-card-text>
            <p>
              ກະລຸນາປ້ອນອີເມວທີ່ທ່ານນຳໃຊ້ສະໝັກໃຊ້ລະບົບເພື່ອຮ້ອງຂໍການຣີເຊັດລະຫັດຜ່ານ
            </p>
            <v-form @submit.prevent="onSend">
              <v-text-field
                v-model="email"
                label="ອີເມວ"
                placeholder="example@domain.com"
                :error-messages="emailErrors"
              ></v-text-field>
              <p v-if="errorMessage" class="red--text">{{ errorMessage }}</p>
              <v-card-actions>
                <v-btn color="primary" :loading="loading" type="submit">
                  <v-icon left>{{ icons.sendIcon }}</v-icon>
                  <span>ຢືນຢັນ</span>
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
