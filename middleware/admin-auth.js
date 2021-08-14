export default async function ({ $axios, store, redirect }) {
  if (!store.state.admin.auth.token) {
    redirect('/login')
  }
  try {
    await $axios.$post(
      '/admins/auth',
      {},
      {
        headers: {
          common: {
            Authorization: `Bearer ${store.state.admin.auth.token}`,
          },
        },
      }
    )
  } catch (err) {
    store.commit('admin/auth/clearAuthData', { root: true })
    redirect('/admin/login')
  }
}
