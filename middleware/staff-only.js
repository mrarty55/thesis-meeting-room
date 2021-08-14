export default function ({ store, redirect }) {
  if (![1, 3].includes(store.state.admin.auth.role)) {
    redirect('/admin/dashboard')
  }
}
