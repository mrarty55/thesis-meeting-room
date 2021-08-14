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
import { required, decimal, minValue } from 'vuelidate/lib/validators'

export default {
  layout: 'admin',
  middleware: 'manager-only',
  data() {
    return {
      title: 'ຂໍ້ມູນເຄື່ອງດື່ມ',
      tableHeaders: [
        {
          text: 'ລໍາດັບ',
          sortable: false,
          value: 'no',
        },
        {
          text: 'ຊື່ເຄື່ອງດື່ມ',
          sortable: true,
          value: 'name',
        },
        {
          text: 'ລາຄາ',
          sortable: true,
          value: 'price',
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
        price: 0,
      },
      defaultItem: {
        id: '',
        name: '',
        description: '',
        image: '',
        price: 0,
      },
      imageFile: null,
      searchDrink: '',
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
      price: { required, decimal, minValue: minValue(1000) },
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    drinkData() {
      return this.$store.state.admin.manage.drinks.drinks
    },
    loading() {
      return this.$store.state.admin.manage.drinks.loading
    },
    error() {
      return this.$store.state.admin.manage.drinks.error
    },
    detailsDialog: {
      get() {
        return this.$store.state.admin.manage.drinks.detailsDialog
      },
      set(value) {
        this.$store.commit('admin/manage/drinks/toggleDetails', value)
      },
    },
    editDialog: {
      get() {
        return this.$store.state.admin.manage.drinks.editDialog
      },
      set(value) {
        return this.$store.commit('admin/manage/drinks/toggleEdit', value)
      },
    },
    deleteDialog: {
      get() {
        return this.$store.state.admin.manage.drinks.deleteDialog
      },
      set(value) {
        this.$store.commit('admin/manage/drinks/toggleDelete', value)
      },
    },
    nameErrors() {
      const errors = []
      if (!this.$v.editItem.name.$dirty) return errors
      !this.$v.editItem.name.required && errors.push('ກະລຸນາປ້ອນຊື່ເຄື່ອງດື່ມ')
      return errors
    },
    priceErrors() {
      const errors = []
      if (!this.$v.editItem.price.$dirty) return errors
      !this.$v.editItem.price.required &&
        errors.push('ກະລຸນາປ້ອນລາຄາເຄື່ອງດື່ມ')
      !this.$v.editItem.price.decimal && errors.push('ກະລຸນາປ້ອນຄ່າເປັນໂຕເລກ')
      !this.$v.editItem.price.minValue &&
        errors.push('ຄວນກໍານົດລາຄາຂັ້ນຕໍ່າເປັນໜຶ່ງພັນກີບຂຶ້ນໄປ')
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
    this.$store.dispatch('admin/manage/drinks/getDrinks')
  },
  methods: {
    onCreateItem() {
      this.editDialog = true
      this.$v.$reset()
      this.editItem = Object.assign({}, this.defaultItem)
    },
    onReadItem(item) {
      this.detailsDialog = true
      this.editIndex = this.drinkData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onEditItem(item) {
      this.editDialog = true
      this.editIndex = this.drinkData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onSaveItem() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      if (this.editIndex === -1) {
        this.$store.dispatch('admin/manage/drinks/createDrink', this.editItem)
      } else {
        const payload = {
          index: this.editIndex,
          drink: this.editItem,
        }
        this.$store.dispatch('admin/manage/drinks/updateDrink', payload)
      }
    },
    async onUploadImage(file) {
      const form = new FormData()
      form.append('image', file)
      try {
        const response = await this.$axios.$post('/drinks/image', form, {
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
      this.editIndex = this.drinkData.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onDeleteConfirm() {
      this.$store.dispatch('admin/manage/drinks/deleteDrink', {
        index: this.editIndex,
        drinkId: this.editItem.id,
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
              :items="drinkData"
              :footer-props="footerProps"
              :search="searchDrink"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-row align="center" class="px-2">
                  <v-card-title>ຕາຕະລາງ{{ title }}</v-card-title>
                  <v-text-field
                    v-model="searchDrink"
                    label="ຄົ້ນຫາ"
                    :prepend-inner-icon="icons.magnifyIcon"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" outlined @click="onCreateItem">
                    <v-icon left>{{ icons.plusIcon }}</v-icon>
                    <span>ເພີ່ມເຄື່ອງດື່ມ</span>
                  </v-btn>
                </v-row>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.price`]="props">
                <span>{{ props.item.price | numFormat('0,0[.]00') }} ກີບ</span>
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
                        <th>ລະຫັດເຄື່ອງດື່ມ</th>
                        <td>D{{ editItem.id | numFormat('000') }}</td>
                      </tr>
                      <tr>
                        <th>ຊື່ເຄື່ອງດື່ມ</th>
                        <td>{{ editItem.name }}</td>
                      </tr>
                      <tr>
                        <th>ຄຳອະທິບາຍ</th>
                        <td>{{ editItem.description || '-' }}</td>
                      </tr>
                      <tr>
                        <th>ລາຄາ</th>
                        <td>
                          {{ editItem.price | numFormat('0,0[.]00') }} ກີບ
                        </td>
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
                    ? 'ເພີ່ມຂໍ້ມູນເຄື່ອງດື່ມ'
                    : 'ແກ້ໄຂຂໍ້ມູນເຄື່ອງດື່ມ'
                }}</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="onSaveItem">
                    <v-text-field
                      v-model="editItem.name"
                      label="ຊື່ເຄຶ່ອງດື່ມ"
                      placeholder="ກາເຟດໍາ"
                      type="text"
                      :error-messages="nameErrors"
                    ></v-text-field>
                    <v-textarea
                      v-model="editItem.description"
                      label="ຄໍາອະທິບາຍ"
                      placeholder="ກາເຟດໍານິລະ, ຊິມີຫຍັງຫຼາຍ..."
                      type="text"
                    ></v-textarea>
                    <v-text-field
                      v-model="editItem.price"
                      label="ລາຄາເຄື່ອງດື່ມ"
                      placeholder="15.000"
                      type="number"
                      :error-messages="priceErrors"
                    ></v-text-field>
                    <v-file-input
                      v-model="imageFile"
                      label="ຮູບເຄື່ອງດື່ມ"
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
