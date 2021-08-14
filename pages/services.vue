<script>
import { mdiLightbulbOnOutline } from '@mdi/js'
export default {
  data() {
    return {
      title: 'ບໍລິການຂອງພວກເຮົາ',
      icons: {
        lightIcon: mdiLightbulbOnOutline,
      },
      servicesInfo: [
        {
          title: 'ເຄື່ອງດື່ມ ແລະ ອາຫານວ່າງ',
          image: 'varee-cafe-service-1.jpg',
          content: 'ຮ້ານຂອງພວກເຮົາມີເຄື່ອງດື່ມຫຼາກຫຼາຍລາຍການໃຫ້ທ່ານໄດ້ເລືອກລອງ',
        },
        {
          title: 'ປຶ້ມຫຼາກຫຼາຍປະເພດ',
          image: 'varee-cafe-service-3.jpg',
          content:
            'ພວກເຮົາມີປຶ້ມຫຼາກຫຼາຍປະເພດໃຫ້ທ່ານເລືອກອ່ານເພື່ອເສີມທັກສະຄວາມຮູ້ແລະພັກຜ່ອນຢ່ອນໃຈ.',
        },
        {
          title: 'ຫ້ອງໃຫ້ເຊົ່າ',
          image: 'varee-cafe-service-2.jpg',
          content:
            'ພວກເຮົາມີຫ້ອງອະເນກປະສົງໃຫ້ທ່ານໄດ້ນຳໃຊ້ຈັດກິດຈະກຳຕ່າງໆ ບໍ່ວ່າຈະເປັນການຈັດງານສຳມະນາ, ງານຝຶກອົບຮົມ, ງານລ້ຽງ ແລະອື່ນໆ.',
          options: [
            {
              title: 'ອອກໃບສະເໜີລາຄາ',
              to: '/public/quotation/form',
            },
          ],
        },
      ],
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="9">
        <v-card>
          <v-card-title>
            <v-icon color="info" size="50" class="mr-2">{{
              icons.lightIcon
            }}</v-icon>
            <span>{{ title }}</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-card
              v-for="item of servicesInfo"
              :key="item.title"
              flat
              tile
              class="d-flex justify-start"
            >
              <v-img
                :src="require(`~/assets/images/${item.image}`)"
                width="256"
                height="256"
              ></v-img>
              <v-row class="mx-2">
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-text>
                  <p>{{ item.content }}</p>
                </v-card-text>
                <v-card-actions v-if="item.options">
                  <v-btn
                    v-for="option of item.options"
                    :key="option.title"
                    outlined
                    color="primary"
                    :to="option.to"
                    >{{ option.title }}</v-btn
                  >
                </v-card-actions>
              </v-row>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.v-card-text__custom {
  font-size: 1rem;
}
</style>
