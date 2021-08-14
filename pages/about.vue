<script>
import { mdiInformationOutline } from '@mdi/js'
export default {
  data() {
    return {
      title: 'ກ່ຽວກັບພວກເຮົາ',
      icons: {
        infoIcon: mdiInformationOutline,
      },
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
              icons.infoIcon
            }}</v-icon>

            <span>{{ title }}</span>
          </v-card-title>
          <v-card-text class="v-card-text__custom">
            <p>
              ຮ້ານກາເຟວະລີເປັນສ່ວນໜື່ງຂອງວິສາຫະກິດສ່ວນບຸກຄົນຮ້ານປຶ້ມແລະສຳນັກພິມດອກເກດ
              ເຊິ່ງໄດ້ເປີດທຳການໃນປີ 2019.
              ຮ້ານຂອງພວກເຮົາມີຈຸດປະສົງເພື່ອເປັນບ່ອນພັກຜ່ອນຢ່ອນໃຈແລະມອບປະສົບການໃໝ່ໃນການຮຽນຮູ້ແກ່ທຸກຄົນ.
            </p>
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
