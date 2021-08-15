<script>
import {
  mdiViewDashboard,
  mdiFaceAgent,
  mdiBook,
  mdiBookCheck,
  mdiDoorOpen,
  mdiHistory,
  mdiDatabaseEdit,
  mdiDoor,
  mdiSpeaker,
  mdiCoffee,
  mdiAccount,
  mdiAccountGroup,
  mdiAccountCircle,
  mdiFileChart,
  mdiCash,
  mdiCog,
  mdiLogout,
  mdiAccountCog,
  mdiWeatherSunny,
  mdiWeatherNight,
  mdiMonitor,
  mdiPalette,
  mdiClipboardCheckMultiple,
} from '@mdi/js'

export default {
  middleware: 'admin-auth',
  data() {
    return {
      drawer: true,
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
          icon: mdiViewDashboard,
          title: 'ໜ້າຫຼັກ',
          to: '/admin/dashboard',
          allow: [1, 2, 3],
        },
        {
          icon: mdiDatabaseEdit,
          title: 'ຈັດການຂໍ້ມູນ',
          allow: [1, 2, 3],
          child: [
            {
              icon: mdiDoor,
              title: 'ຂໍ້ມູນຫ້ອງປະຊຸມ',
              to: '/admin/manage/rooms',
              allow: [1, 2],
            },
            {
              icon: mdiSpeaker,
              title: 'ຂໍ້ມູນອຸປະກອນ',
              to: '/admin/manage/equipments',
              allow: [1, 2],
            },
            {
              icon: mdiCoffee,
              title: 'ຂໍ້ມູນເຄື່ອງດື່ມ',
              to: '/admin/manage/drinks',
              allow: [1, 2],
            },
            {
              icon: mdiAccount,
              title: 'ຂໍ້ມູນລູກຄ້າ',
              to: '/admin/manage/customers',
              allow: [1, 2, 3],
            },
            {
              icon: mdiAccountGroup,
              title: 'ຂໍ້ມູນພະນັກງານ',
              to: '/admin/manage/staffs',
              allow: [1, 2],
            },
          ],
        },
        {
          icon: mdiFaceAgent,
          title: 'ວຽກບໍລິການ',
          to: '/admin/service',
          allow: [1, 2, 3],
          child: [
            {
              icon: mdiBookCheck,
              title: 'ຢືນຢັນການຈອງ',
              to: '/admin/service/confirm-booking',
              allow: [1, 2, 3],
            },
            {
              icon: mdiClipboardCheckMultiple,
              title: 'ແຈ້ງເຂົ້າ',
              to: '/admin/service/checkin',
              allow: [1, 2, 3],
            },
            {
              icon: mdiHistory,
              title: 'ປະຫວັດການຈອງ',
              to: '/admin/service/booking-history',
              allow: [1, 2, 3],
            },
            {
              icon: mdiHistory,
              title: 'ປະຫວັດການເຊົ່າ',
              to: '/admin/service/rent-history',
              allow: [1, 2, 3],
            },
          ],
        },
        {
          icon: mdiFileChart,
          title: 'ລາຍງານ',
          allow: [1, 2, 3],
          child: [
            {
              icon: mdiBook,
              title: 'ລາຍງານການຈອງ',
              to: '/admin/report/booking',
              allow: [1, 2, 3],
            },
            {
              icon: mdiDoorOpen,
              title: 'ລາຍງານການເຊົ່າ',
              to: '/admin/report/rent',
              allow: [1, 2, 3],
            },
            {
              icon: mdiCash,
              title: 'ລາຍງານລາຍຮັບ',
              to: '/admin/report/revenue',
              allow: [1, 2],
            },
            {
              icon: mdiDoor,
              title: 'ລາຍງານຫ້ອງປະຊຸມ',
              to: '/admin/report/rooms',
              allow: [1, 2],
            },
            {
              icon: mdiSpeaker,
              title: 'ລາຍງານອຸປະກອນ',
              to: '/admin/report/equipments',
              allow: [1, 2],
            },
            {
              icon: mdiCoffee,
              title: 'ລາຍງານເຄື່ອງດື່ມ',
              to: '/admin/report/drinks',
              allow: [1, 2],
            },
          ],
        },
        {
          icon: mdiCog,
          title: 'ຕັ້ງຄ່າ',
          to: '/admin/settings',
          allow: [1, 2, 3],
        },
      ],
      icons: {
        paletteIcon: mdiPalette,
        accountCircleIcon: mdiAccountCircle,
        accountCogIcon: mdiAccountCog,
        logoutIcon: mdiLogout,
      },
    }
  },
  head() {
    return {
      titleTemplate: '%s - ລະບົບບໍລິການຫ້ອງປະຊຸມ',
    }
  },
  computed: {
    pageTitle() {
      return this.$store.state.ui.appBarTitle
    },
    role() {
      return this.$store.state.admin.auth.role
    },
    profilePicture() {
      return this.$store.state.admin.auth.image
    },
  },
  watch: {
    '$colorMode.value'() {
      this.$vuetify.theme.dark = this.$colorMode.value === 'dark'
    },
  },
  methods: {
    onLogout() {
      this.$store.dispatch('admin/auth/logout')
    },
  },
}
</script>
<template>
  <v-app>
    <notifier></notifier>
    <v-navigation-drawer v-model="drawer" app dark>
      <div class="pa-2">
        <v-row justify="center" class="pa-2">
          <v-col cols="6">
            <v-img
              :src="require(`~/assets/images/varee-cafe-logo.jpg`)"
            ></v-img>
          </v-col>
        </v-row>
        <v-divider />
        <client-only>
          <v-list>
            <div v-for="item of drawerItems" :key="item.title">
              <v-list-group
                v-if="item.child"
                v-show="item.allow.includes(role)"
                :prepend-icon="item.icon"
                :to="item.to"
              >
                <template #activator>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </template>
                <v-list-item
                  v-for="childItem in item.child"
                  v-show="childItem.allow.includes(role)"
                  :key="childItem.title"
                  :to="childItem.to"
                >
                  <v-list-item-icon>
                    <v-icon>{{ childItem.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ childItem.title }}</v-list-item-title>
                </v-list-item>
              </v-list-group>
              <v-list-item
                v-else
                v-show="item.allow.includes(role)"
                :to="item.to"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </client-only>
      </div>
      <template #append>
        <div class="pa-2">
          <v-btn block color="error" @click="onLogout">
            <v-icon left>{{ icons.logoutIcon }}</v-icon>
            <span>ອອກຈາກລະບົບ</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app absolute dark color="green darken-2">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title v-text="pageTitle" />
      <v-spacer />
      <v-menu>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>{{ icons.paletteIcon }}</v-icon>
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
          <v-btn icon dark v-on="on">
            <v-avatar>
              <v-img
                v-if="profilePicture"
                :src="profilePicture"
                alt="profile picture"
              ></v-img>
              <v-icon v-else>{{ icons.accountCircleIcon }}</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ icons.accountCogIcon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <v-btn text color="primary" to="/admin/settings"
                  >ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້</v-btn
                >
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ icons.logoutIcon }}</v-icon>
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
      <app-footer :app="false"></app-footer>
    </v-main>
  </v-app>
</template>
