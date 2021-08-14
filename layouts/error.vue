<script>
import {
  mdiMonitor,
  mdiPalette,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js'

export default {
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'ບໍ່ພົບໜ້າທີ່ຕ້ອງການເຂົ້າເຖິງ',
      pageNotFoundMessage: 'ບໍ່ພົບໜ້າທີ່ຕ້ອງການເຂົ້າເຖິງ. ກະລຸນາລອງໃໝ່.',
      otherError: 'ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ',
      otherErrorMessage: 'ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ. ກະລຸນາລອງໃໝ່ໃນພາຍຫຼັງ.',
      colorModes: [
        {
          name: 'ຂາວ',
          value: 'light',
          icon: mdiWeatherSunny,
        },
        {
          name: 'ດໍາ',
          value: 'dark',
          icon: mdiWeatherNight,
        },
        {
          name: 'ລະບົບ',
          value: 'system',
          icon: mdiMonitor,
        },
      ],
      navigationItems: [
        {
          title: 'ບໍລິການ',
          to: '/services',
        },
        {
          title: 'ກ່ຽວກັບເຮົາ',
          to: '/about',
        },
        {
          title: 'ເຂົ້າສູ່ລະບົບ',
          to: '/login',
        },
      ],
      paletteIcon: mdiPalette,
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
  watch: {
    '$colorMode.value'() {
      this.$vuetify.theme.dark = this.$colorMode.value === 'dark'
    },
  },
}
</script>
<template>
  <v-app>
    <v-main>
      <v-row justify="center">
        <v-col sm="12" md="6">
          <v-card elevation="0" color="transparent">
            <v-card-title class="justify-sm-center justify-md-start">{{
              error.statusCode === 404 ? pageNotFound : otherError
            }}</v-card-title>
            <v-card-text class="text-sm-center text-md-left">
              <p>
                {{
                  error.statusCode === 404
                    ? pageNotFoundMessage
                    : otherErrorMessage
                }}
              </p>
              <v-img :src="require(`~/assets/images/to-the-moon.png`)"></v-img>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
