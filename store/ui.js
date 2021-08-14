export const state = () => ({
  appBarTitle: '',
  snackbarMessage: '',
  snackbarColor: '',
})

export const mutations = {
  setAppBarTitle(state, title) {
    state.appBarTitle = title
  },
  showMessage(state, payload) {
    state.snackbarMessage = payload.message
    state.snackbarColor = payload.color
  },
}
