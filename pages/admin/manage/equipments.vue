<script>
import {
  mdiClipboardSearch,
  mdiClose,
  mdiContentSave,
  mdiDelete,
  mdiImageOff,
  mdiMagnify,
  mdiPencil,
  mdiPlus,
} from '@mdi/js'
import { required } from 'vuelidate/lib/validators'

export default {
  layout: 'admin',
  middleware: 'manager-only',
  data() {
    return {
      title: 'ຂໍ້ມູນອຸປະກອນ',
      tableHeaders: [
        {
          text: 'ລໍາດັບ',
          sortable: false,
          value: 'no',
        },
        {
          text: 'ຊື່ອຸປະກອນ',
          sortable: true,
          value: 'name',
        },
        {
          text: 'ຮູບປະກອບ',
          sortable: false,
          value: 'image',
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
        name: '',
        description: '',
        image: '',
      },
      defaultItem: {
        id: '',
        name: '',
        description: '',
        image: '',
      },
      imageFile: null,
      searchEquipment: '',
      icons: {
        magnifyIcon: mdiMagnify,
        plusIcon: mdiPlus,
        detailsIcon: mdiClipboardSearch,
        editIcon: mdiPencil,
        deleteIcon: mdiDelete,
        closeIcon: mdiClose,
        saveIcon: mdiContentSave,
        noImageIcon: mdiImageOff,
      },
    }
  },
  validations: {
    editItem: {
      name: { required },
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    equipmentData() {
      return this.$store.state.admin.manage.equipments.equipments
    },
    loading() {
      return this.$store.state.admin.manage.equipments.loading
    },
    error() {
      return this.$store.state.admin.manage.equipments.error
    },
    detailsDialog: {
      get() {
        return this.$store.state.admin.manage.equipments.detailsDialog
      },
      set(value) {
        this.$store.commit('admin/manage/equipments/toggleDetails', value)
      },
    },
    editDialog: {
      get() {
        return this.$store.state.admin.manage.equipments.editDialog
      },
      set(value) {
        return this.$store.commit('admin/manage/equipments/toggleEdit', value)
      },
    },
    deleteDialog: {
      get() {
        return this.$store.state.admin.manage.equipments.deleteDialog
      },
      set(value) {
        this.$store.commit('admin/manage/equipments/toggleDelete', value)
      },
    },
    nameErrors() {
      const errors = []
      if (!this.$v.editItem.name.$dirty) return errors
      !this.$v.editItem.name.required && errors.push('ກະລຸນາປ້ອນຊື່ອຸປະກອນ')
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
    this.$store.dispatch('admin/manage/equipments/getEquipments')
  },
  methods: {
    onCreateItem() {
      this.editDialog = true
      this.$v.$reset()
      this.editItem = Object.assign({}, this.defaultItem)
    },
    onReadItem(item) {
      this.detailsDialog = true
      this.editIndex = this.equipmentData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onEditItem(item) {
      this.editDialog = true
      this.editIndex = this.equipmentData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onSaveItem() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (this.editIndex === -1) {
        this.$store.dispatch(
          'admin/manage/equipments/createEquipment',
          this.editItem
        )
      } else {
        const payload = {
          index: this.editIndex,
          equipment: this.editItem,
        }
        this.$store.dispatch('admin/manage/equipments/updateEquipment', payload)
      }
    },
    async onUploadImage(file) {
      const form = new FormData()
      form.append('image', file)
      try {
        const response = await this.$axios.$post('/equipments/image', form, {
          headers: {
            common: {
              Authorization: `Bearer ${this.$store.state.admin.auth.token}`,
            },
          },
        })
        this.editItem.image = response.image
      } catch (error) {
        this.$notifier.showMessage({
          message: 'ມີຂໍ້ຜິດພາດໃນການເລືອກຮູບ',
          color: 'error',
        })
      }
    },
    onDeleteItem(item) {
      this.deleteDialog = true
      this.editIndex = this.equipmentData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onDeleteConfirm() {
      this.$store.dispatch('admin/manage/equipments/deleteEquipment', {
        index: this.editIndex,
        equipmentId: this.editItem.id,
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
        this.imageFile = null
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
              :items="equipmentData"
              :footer-props="footerProps"
              :search="searchEquipment"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-row align="center" class="px-2">
                  <v-card-title>ຕາຕະລາງ{{ title }}</v-card-title>
                  <v-text-field
                    v-model="searchEquipment"
                    label="ຄົ້ນຫາ"
                    :prepend-inner-icon="icons.magnifyIcon"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" outlined @click="onCreateItem">
                    <v-icon left>{{ icons.plusIcon }}</v-icon>
                    <span>ເພີ່ມອຸປະກອນ</span>
                  </v-btn>
                </v-row>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.image`]="props">
                <v-img
                  v-if="props.item.image"
                  :src="props.item.image"
                  :alt="props.item.name"
                  width="128"
                  height="128"
                  contain
                ></v-img>
                <v-icon v-else size="128">{{ icons.noImageIcon }}</v-icon>
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
                <v-img
                  v-if="editItem.image"
                  :src="editItem.image"
                  :alt="editItem.name"
                  height="256"
                  contain
                ></v-img>
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
                        <th>ລະຫັດອຸປະກອນ</th>
                        <td>E{{ editItem.id | numFormat('000') }}</td>
                      </tr>
                      <tr>
                        <th>ຊື່ອຸປະກອນ</th>
                        <td>{{ editItem.name }}</td>
                      </tr>
                      <tr>
                        <th>ຄຳອະທິບາຍ</th>
                        <td>{{ editItem.description || '-' }}</td>
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
                  editIndex === -1 ? 'ເພີ່ມຂໍ້ມູນອຸປະກອນ' : 'ແກ້ໄຂຂໍ້ມູນອຸປະກອນ'
                }}</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="onSaveItem">
                    <v-text-field
                      v-model="editItem.name"
                      label="ຊື່ອຸປະກອນ"
                      placeholder="ຈໍພາບ"
                      type="text"
                      :error-messages="nameErrors"
                    ></v-text-field>
                    <v-textarea
                      v-model="editItem.description"
                      label="ຄໍາອະທິບາຍ"
                      placeholder="ອຸປະກອນສະແດງຜົນ"
                      type="text"
                    ></v-textarea>
                    <v-file-input
                      v-model="imageFile"
                      label="ຮູບອຸປະກອນ"
                      truncate-length="15"
                      show-size
                      accept="image/jpeg, image/png, image/jpg"
                      @change="onUploadImage"
                    ></v-file-input>
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
