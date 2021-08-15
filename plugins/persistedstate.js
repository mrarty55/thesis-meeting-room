import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'

export default ({ store, req }) => {
  // eslint-disable-next-line no-console
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
  createPersistedState({
    paths: [
      'user.auth.id',
      'user.auth.username',
      'user.auth.image',
      'user.auth.token',
      'admin.auth.id',
      'admin.auth.username',
      'admin.auth.role',
      'admin.auth.image',
      'admin.auth.token',
      'config.settings',
    ],
    storage: {
      getItem: (key) => {
        if (process.server) {
          const parsedCookies = cookie.parse(req.headers.cookie ?? '')
          return parsedCookies[key]
        }
        return Cookies.get(key)
      },
      setItem: (key, value) =>
        Cookies.set(key, value, {
          expires: 1 / 24,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        }),
      removeItem: (key) => Cookies.remove(key),
    },
  })(store)
}
