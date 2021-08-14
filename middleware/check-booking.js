export default function ({ from, store, redirect }) {
  if (process.client) {
    if (!from.includes('form')) {
      redirect('/user/service')
    }
  }
}
