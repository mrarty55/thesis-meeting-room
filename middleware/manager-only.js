export default function ({ store, redirect }) {
  if (![1, 2].includes(store.state.admin.auth.role)) {
    redirect('/admin/dashboard')
  }
}
