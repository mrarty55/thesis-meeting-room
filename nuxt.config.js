import colors from 'vuetify/es5/util/colors'

require('dotenv').config()

export default {
  // Server config
  server: {
    host: process.env.NODE_ENV !== 'production' ? '0.0.0.0' : '127.0.0.1',
    port: 4000,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'lo',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Loading configuration: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-loading
  loading: {
    color: '#388E3C', // Equivalent to green darken-2 in Vuetify
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vuelidate.js',
    '~/plugins/persistedstate.js',
    '~/plugins/axios.js',
    '~/plugins/numberformat.js',
    '~/plugins/vuetify.js',
    '~/plugins/notifier.js',
    '~/plugins/config.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // https://github.com/nuxt-community/date-fns-module
    '@nuxtjs/date-fns',
    // https://color-mode.nuxtjs.org
    '@nuxtjs/color-mode',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://www.npmjs.com/package/cookie-universal-nuxt
    // 'cookie-universal-nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL,
  },

  // date-fns module configuration:
  // Lao locale isn't available at the moment so US English will be used
  dateFns: {
    locales: ['lo', 'en-US'],
    defaultLocale: 'lo',
    fallbackLocale: 'en-US',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/sass/variables.scss'],
    treeShake: true,
    defaultAssets: false,
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      // dark: true,
      themes: {
        // Default theme according to Vuetify's official docs
        // light: {
        //   primary: colors.blue.darken2,
        //   secondary: colors.grey.darken3,
        //   accent: colors.blue.accent1,
        //   error: colors.red.accent2,
        //   info: colors.blue.base,
        //   success: colors.green.base,
        //   warning: colors.amber.base,
        // },
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Nuxt Color Mode configuration
  // colorMode: {
  //   preference: 'light',
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      compact: false, // Avoid a problem working with virtual file system for pdfmake
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
    extend(config, context) {
      if (context.isDev)
        config.devtool = context.isClient ? 'source-map' : 'inline-source-map'
    },
  },
}
