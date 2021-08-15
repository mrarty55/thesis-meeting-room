<script>
import {
  mdiCheckCircle,
  mdiClipboardSearch,
  mdiClose,
  mdiCloseCircle,
  mdiContentSave,
  mdiEmailSend,
  mdiMagnify,
  mdiPencil,
  mdiWhatsapp,
} from '@mdi/js'
import { required } from 'vuelidate/lib/validators'

export default {
  layout: 'admin',
  data() {
    return {
      title: 'ຢືນຢັນການຈອງ',
      pendingTableHeaders: [
        {
          text: 'ລໍາດັບ',
          value: 'no',
          sortable: false,
        },
        {
          text: 'ຊື່ຫົວຂໍ້ງານ',
          value: 'eventTitle',
        },
        {
          text: 'ວັນທີຈັດງານ',
          value: 'eventDate',
        },
        {
          text: 'ເວລາເລີ່ມຕົ້ນ',
          value: 'eventStartTime',
        },
        {
          text: 'ເວລາສິ້ນສຸດ',
          value: 'eventEndTime',
        },
        {
          text: 'ສະຖານະການຈອງ',
          value: 'bookingStatus.name',
        },
        {
          text: 'ຕົວເລືອກ',
          value: 'actions',
          sortable: false,
        },
      ],
      footerProps: {
        'items-per-page-text': 'ຈໍານວນລາຍການ',
        'items-per-page-all-text': 'ທັງໝົດ',
      },
      searchPending: '',
      editIndex: -1,
      editItem: {
        bookingId: '',
        eventTitle: '',
        eventDescription: '',
        eventType: {},
        eventStatus: {},
        eventDate: '',
        eventStartTime: '',
        eventEndTime: '',
        rooms: [],
        equipments: [],
        drinks: [],
        roomStyle: {},
        chair: 0,
        table: 0,
        additionalNote: '',
        depositStatement: '',
      },
      defaultItem: {
        bookingId: '',
        eventTitle: '',
        eventDescription: '',
        eventType: {},
        eventStatus: {},
        eventDate: '',
        eventStartTime: '',
        eventEndTime: '',
        rooms: [],
        equipments: [],
        drinks: [],
        roomStyle: {},
        chair: 0,
        table: 0,
        additionalNote: '',
        depositStatement: '',
      },
      icons: {
        magnifyIcon: mdiMagnify,
        detailsIcon: mdiClipboardSearch,
        confirmIcon: mdiCheckCircle,
        editIcon: mdiPencil,
        saveIcon: mdiContentSave,
        cancelIcon: mdiCloseCircle,
        closeIcon: mdiClose,
        sendMailIcon: mdiEmailSend,
        whatsappIcon: mdiWhatsapp,
      },
    }
  },
  validations: {
    editItem: {
      eventTitle: { required },
      eventType: { required },
      eventStatus: { required },
      roomStyle: { required },
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    pendingBookings() {
      return this.$store.state.admin.service.confirmBooking.pendingBookings
    },
    eventTypes() {
      return this.$store.state.admin.service.confirmBooking.eventTypes
    },
    eventStatus() {
      return this.$store.state.admin.service.confirmBooking.eventStatus
    },
    roomStyles() {
      return this.$store.state.admin.service.confirmBooking.roomStyles
    },
    loading() {
      return this.$store.state.admin.service.confirmBooking.loading
    },
    error() {
      return this.$store.state.admin.service.confirmBooking.error
    },
    detailsDialog: {
      get() {
        return this.$store.state.admin.service.confirmBooking.detailsDialog
      },
      set(value) {
        this.$store.commit('admin/service/confirmBooking/toggleDetails', value)
      },
    },
    editDialog: {
      get() {
        return this.$store.state.admin.service.confirmBooking.editDialog
      },
      set(value) {
        this.$store.commit('admin/service/confirmBooking/toggleEdit', value)
      },
    },
    confirmDialog: {
      get() {
        return this.$store.state.admin.service.confirmBooking.confirmDialog
      },
      set(value) {
        this.$store.commit('admin/service/confirmBooking/toggleConfirm', value)
      },
    },
    cancelDialog: {
      get() {
        return this.$store.state.admin.service.confirmBooking.cancelDialog
      },
      set(value) {
        this.$store.commit('admin/service/confirmBooking/toggleCancel', value)
      },
    },
    nameFromObject() {
      return (item) => item?.name || '-'
    },
    length() {
      return (item) => item?.length || 0
    },
    time() {
      return (item) => item?.substring(0, 5) || '-'
    },
    eventTitleErrors() {
      const errors = []
      if (!this.$v.editItem.eventTitle.$dirty) return errors
      !this.$v.editItem.eventTitle.required &&
        errors.push('ກະລຸນາປ້ອນຫົວຂໍ້ງານ')
      return errors
    },
    eventTypeErrors() {
      const errors = []
      if (!this.$v.editItem.eventType.$dirty) return errors
      !this.$v.editItem.eventType.required && errors.push('ກະລຸນາເລືອກປະເພດງານ')
      return errors
    },
    eventStatusErrors() {
      const errors = []
      if (!this.$v.editItem.eventStatus.$dirty) return errors
      !this.$v.editItem.eventStatus.required &&
        errors.push('ກະລຸນາເລືອກຮູບແບບງານ')
      return errors
    },
    roomStyleErrors() {
      const errors = []
      if (!this.$v.editItem.roomStyle.$dirty) return errors
      !this.$v.editItem.roomStyle.required &&
        errors.push('ກະລຸນາເລືອກຮູບແບບການຈັດຫ້ອງ')
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
    confirmDialog(value) {
      value || this.closeConfirmDialog()
    },
    cancelDialog(value) {
      value || this.closeCancelDialog()
    },
  },
  mounted() {
    this.$store.commit('ui/setAppBarTitle', this.title)
    this.$store.dispatch('admin/service/confirmBooking/getPendingBookings')
    this.$store.dispatch('admin/service/confirmBooking/getEditFormData')
  },
  methods: {
    onReadItem(item) {
      this.detailsDialog = true
      this.editIndex = this.pendingBookings.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onEditItem(item) {
      this.editDialog = true
      this.editIndex = this.pendingBookings.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onSaveItem() {
      if (this.$v.$dirty) this.$v.$reset()
      this.$v.$touch()
      if (this.$v.$invalid) return
      const payload = {
        index: this.editIndex,
        booking: this.editItem,
      }
      this.$store.dispatch(
        'admin/service/confirmBooking/updateBooking',
        payload
      )
    },
    onConfirmBooking(item) {
      this.confirmDialog = true
      this.editIndex = this.pendingBookings.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onConfirm() {
      const payload = {
        index: this.editIndex,
        booking: this.editItem,
      }
      this.$store.dispatch(
        'admin/service/confirmBooking/confirmBooking',
        payload
      )
    },
    onCancelBooking(item) {
      this.cancelDialog = true
      this.editIndex = this.pendingBookings.indexOf(item)
      this.editItem = Object.assign({}, item)
    },
    onCancelConfirm() {
      const payload = {
        index: this.editIndex,
        booking: this.editItem,
      }
      this.$store.dispatch(
        'admin/service/confirmBooking/cancelBooking',
        payload
      )
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
    closeConfirmDialog() {
      this.confirmDialog = false
      this.$nextTick(() => {
        this.editIndex = -1
        this.editItem = Object.assign({}, this.defaultItem)
      })
    },
    closeCancelDialog() {
      this.cancelDialog = false
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
              :items="pendingBookings"
              :headers="pendingTableHeaders"
              :footer-props="footerProps"
              :search="searchPending"
              locale="lo-LA"
              no-data-text="ບໍ່ມີຂໍ້ມູນ"
              no-results-text="ບໍ່ພົບຂໍ້ມູນທີ່ຄົ້ນຫາ"
            >
              <template #top>
                <v-row align="center" class="px-2">
                  <v-card-title
                    >ລາຍການການຈອງຫ້ອງປະຊຸມທີ່ລໍຖ້າຢືນຢັນ</v-card-title
                  >
                  <v-text-field
                    v-model="searchPending"
                    label="ຄົ້ນຫາ"
                    :prepend-inner-icon="icons.magnifyIcon"
                    class="shrink"
                  ></v-text-field>
                </v-row>
              </template>
              <template #[`item.no`]="props">
                <span>{{ props.index + 1 }}</span>
              </template>
              <template #[`item.eventDate`]="props">
                <span>{{
                  $dateFns.format(props.item.eventDate, 'dd/MM/yyyy')
                }}</span>
              </template>
              <template #[`item.eventStartTime`]="props">
                <span>{{ props.item.eventStartTime.substring(0, 5) }}</span>
              </template>
              <template #[`item.eventEndTime`]="props">
                <span>{{ props.item.eventEndTime.substring(0, 5) }}</span>
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
                      :href="`mailto:${props.item.customer.email}`"
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
                      :href="`https://wa.me/${props.item.customer.phoneNumber}`"
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
                      color="success"
                      icon
                      :disabled="props.item.bookingStatus.id === 1"
                      v-bind="attrs"
                      v-on="on"
                      @click="onConfirmBooking(props.item)"
                    >
                      <v-icon>{{ icons.confirmIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>ຢືນຢັນການຈອງ</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="error"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="onCancelBooking(props.item)"
                    >
                      <v-icon>{{ icons.cancelIcon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>ຍົກເລີກການຈອງ</span>
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
                  <span>ລາຍລະອຽດຂໍ້ມູນການຈອງ</span>
                  <v-btn icon color="error" @click="closeDetailsDialog">
                    <v-icon>{{ icons.closeIcon }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-simple-table>
                    <tbody>
                      <tr>
                        <th>ລະຫັດການຈອງ</th>
                        <td>B{{ editItem.id | numFormat('000') }}</td>
                      </tr>
                      <tr>
                        <th>ຫົວຂໍ້ງານ</th>
                        <td>{{ editItem.eventTitle }}</td>
                      </tr>
                      <tr>
                        <th>ຄໍາອະທິບາຍກ່ຽວກັບງານ</th>
                        <td>{{ editItem.eventDescription || '-' }}</td>
                      </tr>
                      <tr>
                        <th>ປະເພດງານ</th>
                        <td>{{ nameFromObject(editItem.eventType) }}</td>
                      </tr>
                      <tr>
                        <th>ຮູບແບບງານ</th>
                        <td>{{ nameFromObject(editItem.eventStatus) }}</td>
                      </tr>
                      <tr>
                        <th>ວັນທີຈັດງານ</th>
                        <td v-if="editItem.eventDate">
                          {{
                            $dateFns.format(editItem.eventDate, 'dd/MM/yyyy')
                          }}
                        </td>
                        <td v-else>-</td>
                      </tr>
                      <tr>
                        <th>ເວລາເລີ່ມຕົ້ນ</th>
                        <td>
                          {{ time(editItem.eventStartTime) }}
                        </td>
                      </tr>
                      <tr>
                        <th>ເວລາສິ້ນສຸດ</th>
                        <td>
                          {{ time(editItem.eventEndTime) }}
                        </td>
                      </tr>
                      <tr>
                        <th>ຫ້ອງ</th>
                        <td v-if="editItem.rooms">
                          <ul>
                            <li v-for="item of editItem.rooms" :key="item.id">
                              {{ item.name }}
                            </li>
                          </ul>
                        </td>
                        <td v-else>-</td>
                      </tr>
                      <tr>
                        <th>ເຄື່ອງດື່ມ</th>
                        <td v-if="editItem.drinks">
                          <ul>
                            <li v-for="item of editItem.drinks" :key="item.id">
                              {{ `${item.name} ${item.amount} ຈອກ` }}
                            </li>
                          </ul>
                        </td>
                        <td v-else>-</td>
                      </tr>
                      <tr>
                        <th>ອຸປະກອນ</th>
                        <td v-if="editItem.equipments">
                          <ul>
                            <li
                              v-for="item of editItem.equipments"
                              :key="item.id"
                            >
                              {{ item.name }}
                            </li>
                          </ul>
                        </td>
                        <td v-else>-</td>
                      </tr>
                      <tr>
                        <th>ຮູບແບບການຈັດຫ້ອງ</th>
                        <td>{{ nameFromObject(editItem.roomStyle) }}</td>
                      </tr>
                      <tr>
                        <th>ຈໍານວນໂຕະ</th>
                        <td>{{ editItem.table }}</td>
                      </tr>
                      <tr>
                        <th>ຈໍານວນຕັ່ງ</th>
                        <td>{{ editItem.chair }}</td>
                      </tr>
                      <tr>
                        <th>ຂໍ້ຄວາມເສີມ</th>
                        <td>{{ editItem.additionalNote || '-' }}</td>
                      </tr>
                      <tr>
                        <th>ຍອດລວມຄ່າຫ້ອງ</th>
                        <td>
                          {{ editItem.roomSubtotal | numFormat('0,0[.]00') }}
                          ກີບ
                        </td>
                      </tr>
                      <tr>
                        <th>ຍອດລວມຄ່າເຄື່ອງດື່ມ</th>
                        <td>
                          {{ editItem.drinkSubtotal | numFormat('0,0[.]00') }}
                          ກີບ
                        </td>
                      </tr>
                      <tr>
                        <th>ຍອດລວມທັງໝົດ</th>
                        <td>
                          {{ editItem.total | numFormat('0,0[.]00') }}
                          ກີບ
                        </td>
                      </tr>
                      <tr>
                        <th>ຄ່າມັດຈໍາທີ່ຕ້ອງຈ່າຍ</th>
                        <td>
                          {{ editItem.deposit | numFormat('0,0[.]00') }}
                          ກີບ
                        </td>
                      </tr>
                      <tr>
                        <th>ຂໍ້ມູນລູກຄ້າ</th>
                        <td v-if="editItem.customer">
                          <ul style="list-style-type: none">
                            <li>
                              {{
                                `ຊື່: ${editItem.customer.firstName} ${editItem.customer.lastName}`
                              }}
                            </li>
                            <li>{{ `ເມວ: ${editItem.customer.email}` }}</li>
                            <li>
                              {{ `ເບີໂທ: ${editItem.customer.phoneNumber}` }}
                            </li>
                          </ul>
                        </td>
                        <td v-else>-</td>
                      </tr>
                      <tr v-if="editItem.staff">
                        <th>ຜູ້ຮັບຜິດຊອບ</th>
                        <td>
                          {{
                            `${editItem.staff.firstName} ${editItem.staff.lastName}`
                          }}
                        </td>
                      </tr>
                      <tr>
                        <th>ຫຼັກຖານຊໍາລະຄ່າມັດຈໍາ</th>
                        <td>
                          <v-img
                            v-if="editItem.depositStatement"
                            :src="editItem.depositStatement"
                            width="256"
                            contain
                            alt="deposit statement"
                          ></v-img>
                          <p v-else>-</p>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="editDialog"
              width="50vw"
              persistent
              :retain-focus="false"
            >
              <v-card>
                <v-card-title>ແກ້ໄຂຂໍ້ມູນການຈອງ</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="onSaveItem">
                    <v-text-field
                      v-model="editItem.eventTitle"
                      label="ຫົວຂໍ້ງານ"
                      placeholder="Google I/O 2021 Extended"
                      :error-messages="eventTitleErrors"
                    ></v-text-field>
                    <v-select
                      v-model="editItem.eventType"
                      label="ປະເພດງານ"
                      :items="eventTypes"
                      item-text="name"
                      item-value="id"
                      return-object
                      :error-messages="eventTypeErrors"
                    ></v-select>
                    <v-select
                      v-model="editItem.eventStatus"
                      label="ຮູບແບບງານ"
                      :items="eventStatus"
                      item-text="name"
                      item-value="id"
                      return-object
                      :error-messages="eventStatusErrors"
                    ></v-select>
                    <v-textarea
                      v-model="editItem.eventDescription"
                      label="ຄໍາອະທິບາຍກ່ຽວກັບງານ"
                      placeholder="ງານສໍາມະນາກ່ຽວກັບເຕັກໂນໂລຊີຈາກ Google"
                    ></v-textarea>
                    <v-select
                      v-model="editItem.roomStyle"
                      label="ຮູບແບບການຈັດຫ້ອງ"
                      :items="roomStyles"
                      item-text="name"
                      item-value="id"
                      return-object
                      :error-messages="roomStyleErrors"
                    ></v-select>
                    <v-textarea
                      v-model="editItem.additionalNote"
                      label="ຂໍ້ຄວາມເສີມ"
                      placeholder="ຕ້ອງການອາຫານຈາກຮ້ານສອງແມ່ລູກ"
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
            <v-dialog
              v-model="confirmDialog"
              width="50vw"
              :retain-focus="false"
            >
              <v-card>
                <v-card-title>ຢືນຢັນການຈອງ</v-card-title>
                <v-card-text>
                  <p>ທ່ານຕ້ອງການຢືນຢັນການຈອງນີ້ຫຼືບໍ່?</p>
                  <p>ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" :loading="loading" @click="onConfirm">
                    <v-icon left>{{ icons.confirmIcon }}</v-icon>
                    <span>ຢືນຢັນ</span>
                  </v-btn>
                  <v-btn outlined color="error" @click="closeConfirmDialog">
                    <v-icon left>{{ icons.closeIcon }}</v-icon>
                    <span>ຍົກເລີກ</span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="cancelDialog" width="50vw" :retain-focus="false">
              <v-card>
                <v-card-title>ຍົກເລີກການຈອງ</v-card-title>
                <v-card-text>
                  <p>ທ່ານຕ້ອງການຍົກເລີກການຈອງນີ້ຫຼືບໍ່?</p>
                  <p>ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້.</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="error"
                    :loading="loading"
                    @click="onCancelConfirm"
                  >
                    <v-icon left>{{ icons.cancelIcon }}</v-icon>
                    <span>ຢືນຢັນ</span>
                  </v-btn>
                  <v-btn outlined @click="closeCancelDialog">
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
