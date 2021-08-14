<script>
import { mdiAccountCircle, mdiContentSave } from '@mdi/js'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
export default {
  layout: 'admin',
  middleware: 'admin-auth',
  data() {
    return {
      title: 'ຕັ້ງຄ່າ',
      tab: null,
      tabs: ['ຂໍ້ມູນຜູ້ໃຊ້', 'ລະຫັດຜ່ານຜູ້ໃຊ້', 'ຂໍ້ມູນລະບົບ'],
      file: null,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        profilePicture: '',
      },
      password: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      settings: [],
      icons: {
        accountIcon: mdiAccountCircle,
        saveIcon: mdiContentSave,
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
    settings: {
      $each: {
        value: { required },
      },
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    profilePicture() {
      return this.$store.state.admin.auth.image
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
    settingsErrors() {
      const errors = []
      if (!this.$v.settings.$dirty) return
      this.$v.settings.$invalid && errors.push('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ')
      return errors
    },
  },
  async mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    // User info
    try {
      const response = await this.$axios.$get('/admins', {
        headers: {
          common: {
            Authorization: `Bearer ${this.$store.state.admin.auth.token}`,
          },
        },
      })
      this.user = Object.assign({}, response.staff)
    } catch (error) {
      const message = error.response?.data?.message || error.message || '-'
      this.$notifier.showMessage({
        message: `ມີຂໍ້ຜິດພາດໃນການດືງຂໍ້ມູນ: ${message}`,
        color: 'error',
      })
    }
    // System config
    try {
      const response = await this.$axios.$get('/settings')
      this.settings = response.settings
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
          '/admins',
          {
            id: this.$store.state.admin.auth.id,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            phoneNumber: this.user.phoneNumber,
            roleId: this.user.role,
            profilePicture: this.user.profilePicture,
          },
          {
            headers: {
              common: {
                Authorization: `Bearer ${this.$store.state.admin.auth.token}`,
              },
            },
          }
        )
        this.file = ''
        this.$store.commit('admin/auth/updatePicture', this.user.profilePicture)
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
        const response = await this.$axios.$post('/admins/image', form, {
          headers: {
            common: {
              Authorization: `Bearer ${this.$store.state.admin.auth.token}`,
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
          '/admins',
          {
            oldPassword: this.password.oldPassword,
            newPassword: this.password.newPassword,
          },
          {
            headers: {
              common: {
                Authorization: `Bearer ${this.$store.state.admin.auth.token}`,
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
    onUpdateSettings() {
      if (this.$v.settings.$dirty) this.$v.$reset()
      this.$v.settings.$touch()
      if (this.$v.settings.$invalid) return
      try {
        this.$store.dispatch('config/updateSettings', this.settings)
        this.$notifier.showMessage({
          message: 'ແກ້ໄຂຂໍ້ມູນລະບົບສຳເລັດ',
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
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab v-for="item of tabs" :key="item">{{ item }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item key="admin-info">
                <div class="d-flex justify-center">
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
              <v-tab-item key="admin-password">
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
              <v-tab-item key="system-config">
                <v-form @submit.prevent="onUpdateSettings">
                  <v-text-field
                    v-for="item of settings"
                    :key="item.id"
                    v-model="item.value"
                    type="number"
                    :label="item.name"
                    placeholder="10"
                  ></v-text-field>
                  <p v-if="settingsErrors" class="red--text">
                    {{ settingsErrors[0] }}
                  </p>
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
