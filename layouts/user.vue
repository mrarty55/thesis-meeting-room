<script>
import {
  mdiAccountCircle,
  mdiAccountCog,
  mdiCog,
  mdiLogout,
  mdiMagnify,
  mdiMonitor,
  mdiPalette,
  mdiRoomService,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js'

export default {
  middleware: 'user-auth',
  data() {
    return {
      title: 'ລະບົບບໍລິການຫ້ອງປະຊຸມ',
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
      drawerItems: [
        {
          icon: mdiRoomService,
          title: 'ບໍລິການ',
          to: '/user/service',
        },
        {
          icon: mdiMagnify,
          title: 'ຄົ້ນຫາຫ້ອງ',
          to: '/user/rooms',
        },
        {
          icon: mdiMagnify,
          title: 'ປະຫວັດ',
          to: '/user/history',
        },
        {
          icon: mdiCog,
          title: 'ຕັ້ງຄ່າ',
          to: '/user/settings',
        },
      ],
      paletteIcon: mdiPalette,
      accountCircleIcon: mdiAccountCircle,
      accountCogIcon: mdiAccountCog,
      logoutIcon: mdiLogout,
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
  methods: {
    onLogout() {
      this.$store.dispatch('user/auth/logout')
    },
  },
}
</script>
<template>
  <v-app>
    <notifier></notifier>
    <v-app-bar app absolute dark color="green darken-2">
      <v-app-bar-title v-text="title" />
      <v-spacer />
      <v-btn v-for="item of drawerItems" :key="item.title" :to="item.to" text>{{
        item.title
      }}</v-btn>
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
      <v-menu>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar>
              <v-img
                v-if="$store.state.user.auth.image"
                :src="$store.state.user.auth.image"
                alt="profile picture"
              ></v-img>
              <v-icon v-else>{{ accountCircleIcon }}</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ accountCogIcon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <v-btn text color="primary" to="/user/settings#user-info"
                  >ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້</v-btn
                >
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ logoutIcon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <v-btn text color="error" @click="onLogout">ອອກຈາກລະບົບ</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <app-footer></app-footer>
  </v-app>
</template>
