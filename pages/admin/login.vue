<script>
import { mdiAccount, mdiLock, mdiLockQuestion, mdiLogin } from '@mdi/js'
import { required } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      title: 'ເຂົ້າສູ່ລະບົບຜູ້ຈັດການ',
      username: '',
      password: '',
      icons: {
        accountIcon: mdiAccount,
        lockIcon: mdiLock,
        loginIcon: mdiLogin,
        forgotPassIcon: mdiLockQuestion,
      },
    }
  },
  validations: {
    username: { required },
    password: { required },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.admin.auth.loading
    },
    errorMessage() {
      return this.$store.state.admin.auth.message
    },
    usernameErrors() {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ຫຼືອີເມວ')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('ກະລຸນາປ້ອນລະຫັດຜ່ານ')
      return errors
    },
  },
  mounted() {
    if (this.$store.state.admin.auth.message.length > 0) {
      this.$store.commit('admin/auth/clearMessage', { root: true })
    }
  },
  methods: {
    onLogin() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.$store.dispatch('admin/auth/login', {
        username: this.username,
        password: this.password,
      })
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col sm="12" md="6">
        <v-card :loading="isLoading">
          <template #progress>
            <v-progress-linear
              color="primary"
              indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title class="justify-center"
            ><h3>{{ title }}</h3>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onLogin">
              <v-text-field
                v-model="username"
                label="ຊື່ຜູ້ໃຊ້ຫຼືອີເມວ"
                :error-messages="usernameErrors"
                :prepend-icon="icons.accountIcon"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="ລະຫັດຜ່ານ"
                :error-messages="passwordErrors"
                :prepend-icon="icons.lockIcon"
                type="password"
                required
              ></v-text-field>
              <div class="pa-2">
                <p v-if="errorMessage.length > 0" class="red--text">
                  {{ errorMessage }}
                </p>
              </div>
              <v-card-actions>
                <v-btn color="primary" :disabled="isLoading" type="submit">
                  <v-icon left>{{ icons.loginIcon }}</v-icon>
                  <span>ເຂົ້າສູ່ລະບົບ</span>
                </v-btn>
                <v-btn
                  color="error"
                  outlined
                  :disabled="isLoading"
                  to="/admin/forgot-password"
                >
                  <v-icon left>{{ icons.forgotPassIcon }}</v-icon>
                  <span>ລືມລະຫັດຜ່ານ?</span>
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
