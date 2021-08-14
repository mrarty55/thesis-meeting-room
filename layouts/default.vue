<script>
import {
  mdiMonitor,
  mdiPalette,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js'

export default {
  data() {
    return {
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
          title: 'ໜ້າຫຼັກ',
          to: '/',
        },
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
    return {
      titleTemplate: '%s - ຮ້ານກາເຟວະລີ',
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
    <notifier />
    <v-app-bar app absolute dark color="green darken-2">
      <v-app-bar-title> ຮ້ານກາເຟວະລີ </v-app-bar-title>
      <v-spacer />
      <v-menu>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>{{ paletteIcon }}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group v-model="$colorMode.preference">
            <v-list-item
              v-for="item of colorModes"
              :key="item.value"
              :value="item.value"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-btn
        v-for="item of navigationItems"
        :key="item.title"
        :to="item.to"
        text
        >{{ item.title }}</v-btn
      >
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <app-footer></app-footer>
  </v-app>
</template>
