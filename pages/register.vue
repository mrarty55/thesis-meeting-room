<script>
import { mdiPlusBox } from '@mdi/js'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      title: 'ລົງທະບຽນ',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      username: '',
      password: '',
      icons: {
        saveIcon: mdiPlusBox,
      },
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.user.auth.loading
    },
    errorMessage() {
      return this.$store.state.user.auth.message
    },
    firstNameErrors() {
      const errors = []
      if (!this.$v.firstName.$dirty) return errors
      !this.$v.firstName.required && errors.push('ກະລຸນາປ້ອນຊື່')
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.lastName.$dirty) return errors
      !this.$v.lastName.required && errors.push('ກະລຸນາປ້ອນນາມສະກຸນ')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push('ກະລຸນາປ້ອນອີເມວ')
      !this.$v.email.email && errors.push('ຮູບແບບທີ່ຢູ່ອີເມວບໍ່ຖືກຕ້ອງ')
      return errors
    },
    phoneNumberErrors() {
      const errors = []
      if (!this.$v.phoneNumber.$dirty) return errors
      !this.$v.phoneNumber.required && errors.push('ກະລຸນາປ້ອນໝາຍເລກໂທລະສັບ')
      return errors
    },
    usernameErrors() {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('ກະລຸນາປ້ອນລະຫັດຜ່ານ')
      !this.$v.password.minLength &&
        errors.push('ລະຫັດຜ່ານຄວນມີຄວາມຍາວແປດໂຕຂຶ້ນໄປ')
      return errors
    },
  },
  mounted() {
    if (this.$store.state.user.auth.message.length > 0) {
      this.$store.commit('user/auth/clearMessage', { root: true })
    }
  },
  methods: {
    onSubmit() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.$store.dispatch('user/auth/register', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        username: this.username,
        password: this.password,
      })
    },
    onClear() {
      this.$v.$reset()
      this.errorMessage = ''
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.phoneNumber = ''
      this.username = ''
      this.password = ''
    },
  },
  validations: {
    firstName: { required },
    lastName: { required },
    email: { required, email },
    phoneNumber: { required },
    username: { required },
    password: { required, minLength: minLength(8) },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col sm="12" md="6">
        <v-card :loading="isLoading">
          <v-card-title class="justify-center">
            <h3>ລົງທະບຽນນໍາໃຊ້ລະບົບ</h3>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-row>
                <v-col sm="12" md="6">
                  <v-text-field
                    v-model="firstName"
                    label="ຊື່"
                    placeholder="John"
                    :error-messages="firstNameErrors"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col sm="12" md="6">
                  <v-text-field
                    v-model="lastName"
                    label="ນາມສະກຸນ"
                    placeholder="Doe"
                    :error-messages="lastNameErrors"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col sm="12" md="6">
                  <v-text-field
                    v-model="email"
                    label="ອີເມວ"
                    placeholder="example@domain.com"
                    :error-messages="emailErrors"
                    type="email"
                  ></v-text-field>
                </v-col>
                <v-col sm="12" md="6">
                  <v-text-field
                    v-model="phoneNumber"
                    label="ໝາຍເລກໂທລະສັບ"
                    placeholder="+85620********"
                    :error-messages="phoneNumberErrors"
                    type="tel"
                  ></v-text-field>
                </v-col>
                <v-col sm="12" md="6">
                  <v-text-field
                    v-model="username"
                    label="ຊື່ຜູ້ໃຊ້"
                    placeholder="john1234"
                    :error-messages="usernameErrors"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col sm="12" md="6">
                  <v-text-field
                    v-model="password"
                    label="ລະຫັດຜ່ານ"
                    placeholder="******"
                    :error-messages="passwordErrors"
                    type="password"
                  ></v-text-field>
                </v-col>
              </v-row>
              <div>
                <p v-if="errorMessage.length > 0" class="red--text">
                  {{ errorMessage }}
                </p>
              </div>
              <v-card-actions>
                <v-btn type="submit" color="primary">
                  <v-icon left>{{ icons.saveIcon }}</v-icon>
                  <span>ລົງທະບຽນ</span>
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
