export default ({ app, store }, inject) => {
  inject('notifier', {
    showMessage({ message = '', color = '' }) {
      store.commit('ui/showMessage', { message, color })
    },
  })
}
