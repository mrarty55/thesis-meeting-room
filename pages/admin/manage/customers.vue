<script>
import {
  mdiClipboardSearch,
  mdiClose,
  mdiContentSave,
  mdiDelete,
  mdiEmailSend,
  mdiMagnify,
  mdiPencil,
  mdiWhatsapp,
} from '@mdi/js'
import { required, email } from 'vuelidate/lib/validators'

export default {
  layout: 'admin',
  data() {
    return {
      title: 'ຂໍ້ມູນລູກຄ້າ',
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
          text: 'ເບີໂທລະສັບ',
          sortable: true,
          value: 'phoneNumber',
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
        workplace: '',
        occupation: '',
        address: '',
        profilePicture: '',
        identification: '',
      },
      defaultItem: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        username: '',
        workplace: '',
        occupation: '',
        address: '',
        profilePicture: '',
        identification: '',
      },
      searchCustomer: '',
      icons: {
        magnifyIcon: mdiMagnify,
        detailsIcon: mdiClipboardSearch,
        editIcon: mdiPencil,
        deleteIcon: mdiDelete,
        closeIcon: mdiClose,
        saveIcon: mdiContentSave,
        sendMailIcon: mdiEmailSend,
        whatsappIcon: mdiWhatsapp,
      },
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
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    customerData() {
      return this.$store.state.admin.manage.customers.customers
    },
    loading() {
      return this.$store.state.admin.manage.customers.loading
    },
    error() {
      return this.$store.state.admin.manage.customers.error
    },
    detailsDialog: {
      get() {
        return this.$store.state.admin.manage.customers.detailsDialog
      },
      set(value) {
        this.$store.commit('admin/manage/customers/toggleDetails', value)
      },
    },
    editDialog: {
      get() {
        return this.$store.state.admin.manage.customers.editDialog
      },
      set(value) {
        return this.$store.commit('admin/manage/customers/toggleEdit', value)
      },
    },
    deleteDialog: {
      get() {
        return this.$store.state.admin.manage.customers.deleteDialog
      },
      set(value) {
        this.$store.commit('admin/manage/customers/toggleDelete', value)
      },
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
  },
  watch: {
    detailsDialog(value) {
      value || this.closeDetailsDialog()
    },
    editDialog(value) {
      value || this.closeEditDialog()
    },
    deleteDialog(value) {
      value || this.closeDeleteDialog()
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/manage/customers/getUsers')
  },
  methods: {
    onReadItem(item) {
      this.detailsDialog = true
      this.editIndex = this.customerData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onEditItem(item) {
      this.editDialog = true
      this.editIndex = this.customerData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onSaveItem() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (this.editIndex !== -1) {
        const payload = {
          index: this.editIndex,
          customer: this.editItem,
        }
        this.$store.dispatch('admin/manage/customers/updateCustomer', payload)
      }
    },
    onDeleteItem(item) {
      this.deleteDialog = true
      this.editIndex = this.customerData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onDeleteConfirm() {
      this.$store.dispatch('admin/manage/customers/deleteCustomer', {
        index: this.editIndex,
        customer: this.editItem,
      })
    },
    closeDetailsDialog() {
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
      })
    },
    closeDeleteDialog() {
      this.deleteDialog = false
      this.$nextTick(() => {
        this.editIndex = -1
        this.editItem = Object.assign({}, this.defaultItem)
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
              :items="customerData"
              :footer-props="footerProps"
              :search="searchCustomer"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-row align="center" class="px-2">
                  <v-card-title>ຕາຕະລາງ{{ title }}</v-card-title>
                  <v-text-field
                    v-model="searchCustomer"
                    label="ຄົ້ນຫາ"
                    :prepend-inner-icon="icons.magnifyIcon"
                    class="shrink"
                  ></v-text-field>
                </v-row>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
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
                      :href="`mailto:${props.item.email}`"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>{{ icons.sendMailIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>ຕິດຕໍ່ຜ່ານທາງອີເມວ</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      icon
                      :href="`https://wa.me/${props.item.phoneNumber}`"
                      target="_blank"
                      rel="noopener noreferer"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>{{ icons.whatsappIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>ຕິດຕໍ່ຜ່ານທາງວັອສແອັບ</span>
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
                  <v-btn color="error" icon @click="closeDetailsDialog">
                    <v-icon>{{ icons.closeIcon }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-simple-table>
                    <tbody>
                      <tr>
                        <th>ລະຫັດລູກຄ້າ</th>
                        <td>C{{ editItem.id | numFormat('000') }}</td>
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
                        <th>ບ່ອນປະຈໍາການ</th>
                        <td>{{ editItem.workplace }}</td>
                      </tr>
                      <tr>
                        <th>ຕໍາແໜ່ງ</th>
                        <td>{{ editItem.occupation }}</td>
                      </tr>
                      <tr>
                        <th>ທີ່ຢູ່</th>
                        <td>{{ editItem.address }}</td>
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
                <v-card-title>ແກ້ໄຂຂໍ້ມູນລູກຄ້າ</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="onSaveItem">
                    <v-text-field
                      v-model="editItem.firstName"
                      label="ຊື່"
                      placeholder="John"
                      type="text"
                      :error-messages="firstNameErrors"
                    ></v-text-field>
                    <v-text-field
                      v-model="editItem.lastName"
                      label="ນາມສະກຸນ"
                      placeholder="Doe"
                      type="text"
                      :error-messages="lastNameErrors"
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
                    <v-text-field
                      v-model="editItem.workplace"
                      label="ບ່ອນປະຈໍາການ"
                      placeholder="ບໍລິສັດ"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="editItem.occupation"
                      label="ຕໍາແໜ່ງ"
                      placeholder="ພະນັກງານ"
                      type="text"
                    ></v-text-field>
                    <v-textarea
                      v-model="editItem.address"
                      label="ທີ່ຢູ່"
                      placeholder="ບ້ານເມືອງແຂວງ"
                      type="text"
                    ></v-textarea>
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
