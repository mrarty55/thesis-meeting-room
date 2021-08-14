<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import { mdiAccountCircle, mdiContentSave } from '@mdi/js'
export default {
  layout: 'user',
  data() {
    return {
      title: 'ຕັ້ງຄ່າ',
      tab: null,
      tabs: ['ຂໍ້ມູນຜູ້ໃຊ້', 'ລະຫັດຜ່ານຜູ້ໃຊ້'],
      file: null,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        workplace: '',
        occupation: '',
        address: '',
        profilePicture: '',
      },
      password: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      icons: {
        saveIcon: mdiContentSave,
        accountIcon: mdiAccountCircle,
      },
    }
  },
  validations: {
    user: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      phoneNumber: { required },
    },
    password: {
      oldPassword: { required, minLength: minLength(8) },
      newPassword: { required, minLength: minLength(8) },
      confirmNewPassword: { required, sameAs: sameAs('newPassword') },
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    profilePicture() {
      return this.$store.state.user.auth.image
    },
    firstNameErrors() {
      const errors = []
      if (!this.$v.user.firstName.$dirty) return errors
      !this.$v.user.firstName.required && errors.push('ກະລຸນາປ້ອນຊື່')
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.user.lastName.$dirty) return errors
      !this.$v.user.lastName.required && errors.push('ກະລຸນາປ້ອນນາມສະກຸນ')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.user.email.$dirty) return errors
      !this.$v.user.email.required && errors.push('ກະລຸນາປ້ອນອີເມວ')
      !this.$v.user.email.email && errors.push('ຮູບແບບທີ່ຢູ່ອີເມວບໍ່ຖືກຕ້ອງ')
      return errors
    },
    phoneNumberErrors() {
      const errors = []
      if (!this.$v.user.phoneNumber.$dirty) return errors
      !this.$v.user.phoneNumber.required && errors.push('ກະລຸນາປ້ອນເບີໂທລະສັບ')
      return errors
    },
    oldPasswordErrors() {
      const errors = []
      if (!this.$v.password.oldPassword.$dirty) return
      !this.$v.password.oldPassword.required &&
        errors.push('ກະລຸນາປ້ອນລະຫັດຜ່ານປັດຈຸບັນ')
      !this.$v.password.oldPassword.minLength &&
        errors.push('ລະຫັດຜ່ານຄວນມີຄວາມຍາວຢ່າງໜ້ອຍແປດໂຕ')
      return errors
    },
    newPasswordErrors() {
      const errors = []
      if (!this.$v.password.newPassword.$dirty) return
      !this.$v.password.newPassword.required &&
        errors.push('ກະລຸນາປ້ອນລະຫັດຜ່ານໃໝ່')
      !this.$v.password.newPassword.minLength &&
        errors.push('ລະຫັດຜ່ານຄວນມີຄວາມຍາວຢ່າງໜ້ອຍແປດໂຕ')
      return errors
    },
    confirmNewPasswordErrors() {
      const errors = []
      if (!this.$v.password.confirmNewPassword.$dirty) return
      !this.$v.password.confirmNewPassword.required &&
        errors.push('ກະລຸນາຢືນຢັນລະຫັດຜ່ານໃໝ່')
      !this.$v.password.confirmNewPassword.sameAs &&
        errors.push('ລະຫັດຜ່ານບໍ່ກົງກັນ')
      return errors
    },
  },
  async mounted() {
    try {
      const response = await this.$axios.$get('/users', {
        headers: {
          common: {
            Authorization: `Bearer ${this.$store.state.user.auth.token}`,
          },
        },
      })
      this.user = Object.assign({}, response.customer)
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
  },
  methods: {
    async onUpdateInfo() {
      if (this.$v.user.$dirty) this.$v.$reset()
      this.$v.user.$touch()
      if (this.$v.user.$invalid) return
      try {
        await this.$axios.$put(
          '/users',
          {
            id: this.$store.state.user.auth.id,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            phoneNumber: this.user.phoneNumber,
            workplace: this.user.workplace,
            occupation: this.user.occupation,
            address: this.user.address,
            profilePicture: this.user.profilePicture,
          },
          {
            headers: {
              common: {
                Authorization: `Bearer ${this.$store.state.user.auth.token}`,
              },
            },
          }
        )
        this.file = ''
        this.$store.commit('user/auth/updatePicture', this.user.profilePicture)
        this.$notifier.showMessage({
          message: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ',
          color: 'success',
        })
      } catch (error) {
        const message = error.response?.data?.message || error.message || '-'
        this.$notifier.showMessage({
          message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
          color: 'error',
        })
      }
    },
    async onUploadPicture(file) {
      const form = new FormData()
      form.append('image', file)
      try {
        const response = await this.$axios.$post('/users/image', form, {
          headers: {
            common: {
              Authorization: `Bearer ${this.$store.state.user.auth.token}`,
            },
          },
        })
        this.user.profilePicture = response.image
      } catch (error) {
        const message = error.response?.data?.message || error.message || '-'
        this.$notifier.showMessage({
          message: `ມີຂໍ້ຜິດພາດໃນການອັບໂຫຼດຮູບ: ${message}`,
          color: 'error',
        })
      }
    },
    async onUpdatePassword() {
      if (this.$v.password.$dirty) this.$v.$reset()
      this.$v.password.$touch()
      if (this.$v.password.$invalid) return
      try {
        await this.$axios.patch(
          '/users',
          {
            oldPassword: this.password.oldPassword,
            newPassword: this.password.newPassword,
          },
          {
            headers: {
              common: {
                Authorization: `Bearer ${this.$store.state.user.auth.token}`,
              },
            },
          }
        )
        this.password = {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }
        this.$v.password.$reset()
        this.$notifier.showMessage({
          message: 'ແກ້ໄຂລະຫັດຜ່ານສຳເລັດ',
          color: 'success',
        })
      } catch (error) {
        const message = error.response?.data?.message || error.message || '-'
        this.$notifier.showMessage({
          message: `ມີຂໍ້ຜິດພາດໃນການແກ້ໄຂລະຫັດຜ່ານ: ${message}`,
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
          <v-card-title class="justify-center">{{ title }}</v-card-title>
          <v-card-text>
            <v-tabs v-model="tab" grow>
              <v-tab v-for="item of tabs" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item key="user-info">
                <div class="d-flex justify-center my-4">
                  <v-avatar size="128">
                    <v-img
                      v-if="profilePicture"
                      :src="profilePicture"
                      :alt="user.firstName"
                    ></v-img>
                    <v-icon v-else>{{ icons.accountIcon }}</v-icon>
                  </v-avatar>
                </div>
                <v-form @submit.prevent="onUpdateInfo">
                  <v-text-field
                    v-model="user.firstName"
                    type="text"
                    label="ຊື່"
                    placeholder="John"
                    :error-messages="firstNameErrors"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.lastName"
                    type="text"
                    label="ນາມສະກຸນ"
                    placeholder="Doe"
                    :error-messages="lastNameErrors"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.email"
                    type="email"
                    label="ອີເມວ"
                    placeholder="name@domain.com"
                    :error-messages="emailErrors"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.phoneNumber"
                    type="text"
                    label="ເບີໂທ"
                    placeholder="+85620XXXXXXXX"
                    :error-messages="phoneNumberErrors"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.workplace"
                    type="text"
                    label="ບ່ອນປະຈຳການ"
                    placeholder="ບໍລິສັດ"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.occupation"
                    type="text"
                    label="ຕໍາແໜ່ງ"
                    placeholder="ພະນັກງານ"
                  ></v-text-field>
                  <v-textarea
                    v-model="user.address"
                    type="text"
                    label="ທີ່ຢູ່"
                    placeholder="ບ້ານເມືອງແຂວງ"
                  ></v-textarea>
                  <v-file-input
                    v-model="file"
                    label="ຮູບໂປຣຟາຍ"
                    accept="image/png, image/jpg, image/jpeg"
                    @change="onUploadPicture"
                  ></v-file-input>
                  <v-btn color="primary" type="submit">
                    <v-icon left>{{ icons.saveIcon }}</v-icon>
                    <span>ບັນທຶກ</span>
                  </v-btn>
                </v-form>
              </v-tab-item>
              <v-tab-item key="change-password">
                <v-form @submit.prevent="onUpdatePassword">
                  <v-text-field
                    v-model="password.oldPassword"
                    type="password"
                    label="ລະຫັດຜ່ານປັດຈຸບັນ"
                    placeholder="********"
                    :error-messages="oldPasswordErrors"
                  ></v-text-field>
                  <v-text-field
                    v-model="password.newPassword"
                    type="password"
                    label="ລະຫັດຜ່ານໃໝ່"
                    placeholder="********"
                    :error-messages="newPasswordErrors"
                  ></v-text-field>
                  <v-text-field
                    v-model="password.confirmNewPassword"
                    type="password"
                    label="ຢືນຢັນລະຫັດຜ່ານໃໝ່"
                    placeholder="********"
                    :error-messages="confirmNewPasswordErrors"
                  ></v-text-field>
                  <v-btn color="primary" type="submit">
                    <v-icon left>{{ icons.saveIcon }}</v-icon>
                    <span>ບັນທຶກ</span>
                  </v-btn>
                </v-form>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
