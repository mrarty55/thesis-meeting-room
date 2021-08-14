export default async function ({ $axios, store, redirect }) {
  if (!store.state.user.auth.token) {
    redirect('/login')
  }
  try {
    await $axios.$post(
      '/users/auth',
      {},
      {
        headers: {
          common: {
            Authorization: `Bearer ${store.state.user.auth.token}`,
          },
        },
      }
    )
  } catch (err) {
    store.commit('user/auth/clearAuthData', { root: true })
    redirect('/login')
  }
}
