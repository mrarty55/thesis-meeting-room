<script>
import {
  mdiMagnify,
  mdiPlus,
  mdiClipboardSearch,
  mdiPencil,
  mdiDelete,
  mdiClose,
  mdiContentSave,
  mdiAccount,
} from '@mdi/js'
import {
  required,
  requiredIf,
  email,
  minLength,
} from 'vuelidate/lib/validators'

export default {
  layout: 'admin',
  middleware: 'manager-only',
  data() {
    return {
      title: 'ຂໍ້ມູນພະນັກງານ',
      tableHeaders: [
        {
          text: 'ລໍາດັບ',
          sortable: false,
          value: 'no',
        },
        {
          text: 'ຊື່',
          sortable: true,
          value: 'firstName',
        },
        {
          text: 'ນາມສະກຸນ',
          sortable: true,
          value: 'lastName',
        },
        {
          text: 'ອີເມວ',
          sortable: true,
          value: 'email',
        },
        {
          text: 'ຕໍາແໜ່ງ',
          sortable: true,
          value: 'role',
        },
        {
          text: 'ຮູບປະຈຳໂຕ',
          sortable: false,
          value: 'profilePicture',
        },
        {
          text: 'ຕົວເລືອກ',
          sortable: false,
          value: 'actions',
        },
      ],
      footerProps: {
        'items-per-page-text': 'ຈໍານວນລາຍການ',
        'items-per-page-all-text': 'ທັງໝົດ',
      },
      editIndex: -1,
      editItem: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
        role: '',
        profilePicture: '',
      },
      defaultItem: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
        role: '',
        profilePicture: '',
      },
      password: '',
      searchStaff: '',
      icons: {
        magnifyIcon: mdiMagnify,
        plusIcon: mdiPlus,
        detailsIcon: mdiClipboardSearch,
        editIcon: mdiPencil,
        deleteIcon: mdiDelete,
        closeIcon: mdiClose,
        saveIcon: mdiContentSave,
        userIcon: mdiAccount,
      },
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  validations: {
    editItem: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      phoneNumber: { required },
      username: { required },
    },
    password: {
      required: requiredIf(function () {
        return this.editIndex === -1
      }),
      minLength: minLength(8),
    },
  },
  computed: {
    staffData() {
      return this.$store.state.admin.manage.staffs.staffs
    },
    staffRoles() {
      return this.$store.state.admin.manage.staffs.roles
    },
    loading() {
      return this.$store.state.admin.manage.staffs.loading
    },
    error() {
      return this.$store.state.admin.manage.staffs.error
    },
    detailsDialog: {
      get() {
        return this.$store.state.admin.manage.staffs.detailsDialog
      },
      set(value) {
        this.$store.commit('admin/manage/staffs/toggleDetails', value)
      },
    },
    editDialog: {
      get() {
        return this.$store.state.admin.manage.staffs.editDialog
      },
      set(value) {
        return this.$store.commit('admin/manage/staffs/toggleEdit', value)
      },
    },
    deleteDialog: {
      get() {
        return this.$store.state.admin.manage.staffs.deleteDialog
      },
      set(value) {
        this.$store.commit('admin/manage/staffs/toggleDelete', value)
      },
    },
    roleName() {
      return (item) =>
        this.staffRoles.find((role) => role.id === item)?.description
    },
    firstNameErrors() {
      const errors = []
      if (!this.$v.editItem.firstName.$dirty) return errors
      !this.$v.editItem.firstName.required && errors.push('ກະລຸນາປ້ອນຊື່')
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.editItem.lastName.$dirty) return errors
      !this.$v.editItem.lastName.required && errors.push('ກະລຸນາປ້ອນນາມສະກຸນ')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.editItem.email.$dirty) return errors
      !this.$v.editItem.email.required && errors.push('ກະລຸນາປ້ອນອີເມວ')
      !this.$v.editItem.email.email &&
        errors.push('ຮູບແບບທີ່ຢູ່ອີເມວບໍ່ຖືກຕ້ອງ')
      return errors
    },
    phoneNumberErrors() {
      const errors = []
      if (!this.$v.editItem.phoneNumber.$dirty) return errors
      !this.$v.editItem.phoneNumber.required &&
        errors.push('ກະລຸນາປ້ອນເບີໂທລະສັບ')
      return errors
    },
    usernameErrors() {
      const errors = []
      if (!this.$v.editItem.username.$dirty) return errors
      !this.$v.editItem.username.required && errors.push('ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້')
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
  watch: {
    editDialog(value) {
      value || this.closeEditDialog()
    },
    detailsDialog(value) {
      value || this.closedetailDialog()
    },
    deleteDialog(value) {
      value || this.closeDeleteDialog()
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/manage/staffs/getStaffs')
    this.$store.dispatch('admin/manage/staffs/getRoles')
  },
  methods: {
    onCreateItem() {
      this.editDialog = true
      this.$v.$reset()
      this.editIndex = -1
      this.password = ''
      this.editItem = Object.assign({}, this.defaultItem)
    },
    onReadItem(item) {
      this.detailsDialog = true
      this.editIndex = this.staffData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onEditItem(item) {
      this.editDialog = true
      this.editIndex = this.staffData.indexOf(item)
      this.password = ''
      this.editItem = Object.assign({}, item)
    },
    onSaveItem() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (this.editIndex === -1) {
        this.$store.dispatch('admin/manage/staffs/createStaff', {
          staff: this.editItem,
          password: this.password,
        })
      } else {
        const payload = {
          index: this.editIndex,
          staff: this.editItem,
        }
        this.$store.dispatch('admin/manage/staffs/updateStaff', payload)
      }
    },
    onDeleteItem(item) {
      this.deleteDialog = true
      this.editIndex = this.staffData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onDeleteConfirm() {
      this.$store.dispatch('admin/manage/staffs/deleteStaff', {
        index: this.editIndex,
        staffId: this.editItem.id,
      })
    },
    closedetailDialog() {
      this.detailsDialog = false
      this.$nextTick(() => {
        this.editIndex = -1
        this.editItem = Object.assign({}, this.defaultItem)
      })
    },
    closeEditDialog() {
      this.editDialog = false
      this.$nextTick(() => {
        this.editIndex = -1
        this.editItem = Object.assign({}, this.defaultItem)
        this.password = ''
        this.$store.commit('admin/manage/staffs/toggleError', false)
      })
    },
    closeDeleteDialog() {
      this.deleteDialog = false
      this.$nextTick(() => {
        this.editIndex = -1
        this.editItem = Object.assign({}, this.defaultItem)
        this.$store.commit('admin/manage/staffs/toggleError', false)
      })
    },
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="staffData"
              :footer-props="footerProps"
              :search="searchStaff"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-row align="center" class="px-2">
                  <v-card-title>ຕາຕະລາງ{{ title }}</v-card-title>
                  <v-text-field
                    v-model="searchStaff"
                    label="ຄົ້ນຫາ"
                    :prepend-inner-icon="icons.magnifyIcon"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" outlined @click="onCreateItem">
                    <v-icon left>{{ icons.plusIcon }}</v-icon>
                    <span>ເພີ່ມພະນັກງານ</span>
                  </v-btn>
                </v-row>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.role`]="props">
                <span>{{ roleName(props.item.role) }}</span>
              </template>
              <template #[`item.profilePicture`]="props">
                <v-img
                  v-if="props.item.profilePicture"
                  :src="props.item.profilePicture"
                  height="128"
                  width="128"
                  contain
                  alt="props.item.username"
                ></v-img>
                <v-icon v-else size="128">{{ icons.userIcon }}</v-icon>
              </template>
              <template #[`item.actions`]="props">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="info"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="onReadItem(props.item)"
                    >
                      <v-icon>{{ icons.detailsIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>ລາຍລະອຽດ</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="onEditItem(props.item)"
                    >
                      <v-icon>{{ icons.editIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>ແກ້ໄຂ</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="error"
                      icon
                      :disabled="
                        props.item.id === 1 ||
                        props.item.id === $store.state.admin.auth.id
                      "
                      v-bind="attrs"
                      v-on="on"
                      @click="onDeleteItem(props.item)"
                    >
                      <v-icon>{{ icons.deleteIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>ລຶບ</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <v-dialog
              v-model="detailsDialog"
              width="50vw"
              :retain-focus="false"
            >
              <v-card>
                <v-card-title class="justify-space-between">
                  <span>ລາຍລະອຽດ{{ title }}</span>
                  <v-btn color="error" icon @click="closedetailDialog">
                    <v-icon>{{ icons.closeIcon }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-simple-table>
                    <tbody>
                      <tr>
                        <th>ລະຫັດພະນັກງານ</th>
                        <td>S{{ editItem.id | numFormat('000') }}</td>
                      </tr>
                      <tr>
                        <th>ຊື່</th>
                        <td>{{ editItem.firstName }}</td>
                      </tr>
                      <tr>
                        <th>ນາມສະກຸນ</th>
                        <td>{{ editItem.lastName }}</td>
                      </tr>
                      <tr>
                        <th>ອີເມວ</th>
                        <td>{{ editItem.email }}</td>
                      </tr>
                      <tr>
                        <th>ເບີໂທລະສັບ</th>
                        <td>{{ editItem.phoneNumber }}</td>
                      </tr>
                      <tr>
                        <th>ຊື່ຜູ້ໃຊ້</th>
                        <td>{{ editItem.username }}</td>
                      </tr>
                      <tr>
                        <th>ຕໍາແໜ່ງ</th>
                        <td>{{ roleName(editItem.role) }}</td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="editDialog"
              width="75vw"
              scrollable
              persistent
              :retain-focus="false"
            >
              <v-card max-height="90vh">
                <v-card-title>{{
                  editIndex === -1
                    ? 'ເພີ່ມຂໍ້ມູນພະນັກງານ'
                    : 'ແກ້ໄຂຂໍ້ມູນພະນັກງານ'
                }}</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="onSaveItem">
                    <v-text-field
                      v-model="editItem.firstName"
                      label="ຊື່"
                      placeholder="ພິລະພົນ"
                      type="text"
                      :error-messages="firstNameErrors"
                    ></v-text-field>
                    <v-text-field
                      v-model="editItem.lastName"
                      label="ນາມສະກຸນ"
                      placeholder="ອິນທະວົງສາ"
                      type="text"
                      :error-messages="lastNameErrors"
                    ></v-text-field>
                    <v-text-field
                      v-model="editItem.username"
                      :disabled="editIndex !== -1"
                      label="ຊື່ຜູ້ໃຊ້"
                      placeholder="philaphonh555"
                      type="text"
                      :error-messages="usernameErrors"
                    ></v-text-field>
                    <v-text-field
                      v-if="editIndex === -1"
                      v-model="password"
                      label="ລະຫັດຜ່ານ"
                      placeholder="P******d"
                      type="password"
                      :error-messages="passwordErrors"
                    ></v-text-field>
                    <v-text-field
                      v-model="editItem.email"
                      label="ອີເມວ"
                      placeholder="name@domain.com"
                      type="email"
                      :error-messages="emailErrors"
                    ></v-text-field>
                    <v-text-field
                      v-model="editItem.phoneNumber"
                      label="ເບີໂທລະສັບ"
                      placeholder="+85620XXXXXXXX"
                      type="text"
                      :error-messages="phoneNumberErrors"
                    ></v-text-field>
                    <v-select
                      v-model="editItem.role"
                      label="ຕໍາແໜ່ງ"
                      placeholder="ກະລຸນາລະບຸຕໍາແໜ່ງ"
                      :items="staffRoles"
                      item-text="description"
                      item-value="id"
                    ></v-select>
                    <v-card-actions>
                      <v-btn color="primary" :loading="loading" type="submit">
                        <v-icon left>{{ icons.saveIcon }}</v-icon>
                        <span>ບັນທຶກ</span>
                      </v-btn>
                      <v-btn
                        color="error"
                        outlined
                        :disabled="loading"
                        @click="closeEditDialog"
                      >
                        <v-icon>{{ icons.closeIcon }}</v-icon>
                        <span>ຍົກເລີກ</span>
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog v-model="deleteDialog" width="25vw" :retain-focus="false">
              <v-card>
                <v-card-title>ຢືນຢັນການລຶບ</v-card-title>
                <v-card-text>
                  <p>ທ່ານຕ້ອງການລຶບຂໍ້ມູນແທ້ຫຼືບໍ່?</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="error"
                    :loading="loading"
                    @click="onDeleteConfirm"
                  >
                    <v-icon left>{{ icons.deleteIcon }}</v-icon>
                    <span>ຢືນຢັນ</span>
                  </v-btn>
                  <v-btn
                    :disabled="loading"
                    outlined
                    @click="closeDeleteDialog"
                  >
                    <v-icon left>{{ icons.closeIcon }}</v-icon>
                    <span>ຍົກເລີກ</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
