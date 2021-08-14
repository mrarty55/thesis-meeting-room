<script>
import { mdiCheck } from '@mdi/js'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
export default {
  middleware: async ({ query, $axios, redirect }) => {
    try {
      await $axios.$post(
        '/admins/token',
        {},
        { headers: { common: { Authorization: `Bearer ${query.token}` } } }
      )
    } catch (error) {
      redirect('/login')
    }
  },
  data() {
    return {
      title: 'ຣີເຊັດລະຫັດຜ່ານ',
      token: '',
      password: '',
      confirmPassword: '',
      icons: {
        confirmIcon: mdiCheck,
      },
    }
  },
  validations: {
    password: { required, minLength: minLength(8) },
    confirmPassword: { required, sameAs: sameAs('password') },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return
      !this.$v.password.required && errors.push('ກະລຸນາປ້ອນລະຫັດຜ່ານ')
      !this.$v.password.minLength &&
        errors.push('ລະຫັດຜ່ານຄວນມີຄວາມຍາວຢ່າງໜ້ອຍແປດໂຕ')
      return errors
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.$v.confirmPassword.$dirty) return
      !this.$v.confirmPassword.required && errors.push('ກະລຸນາຢືນຢັນລະຫັດຜ່ານ')
      !this.$v.confirmPassword.sameAs && errors.push('ລະຫັດຜ່ານບໍ່ກົງກັນ')
      return errors
    },
  },
  mounted() {
    this.token = this.$route.query.token
  },
  methods: {
    async onReset() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      try {
        await this.$axios.$patch(
          '/admins',
          {
            password: this.password,
          },
          { headers: { common: { Authorization: `Bearer ${this.token}` } } }
        )
        this.$router.push('/admin/login')
        this.$notifier.showMessage({
          message: `ຣີເຊັດລະຫຼັດຜ່ານສຳເລັດແລ້ວ`,
          color: 'success',
        })
      } catch (error) {
        const message = error.response?.data?.message || error.message || '-'
        this.$notifier.showMessage({
          message: `ມີຂໍ້ຜິດພາດໃນການຣິເຊັດລະຫຼັດຜ່ານ: ${message}`,
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
      <v-col cols="12" sm="12" md="6">
        <v-card>
          <v-card-title>ຣີເຊັດລະຫັດຜ່ານ</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onReset">
              <v-text-field
                v-model="password"
                type="password"
                label="ລະຫັດຜ່ານໃຫມ່"
                :error-messages="passwordErrors"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                type="password"
                label="ຢືນຢັນລະຫັດຜ່ານໃຫມ່"
                :error-messages="confirmPasswordErrors"
              ></v-text-field>
              <v-card-actions>
                <v-btn color="primary" type="submit">
                  <v-icon left>{{ icons.confirmIcon }}</v-icon>
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
