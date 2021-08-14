<script>
import { mdiClose } from '@mdi/js'

export default {
  data() {
    return {
      message: '',
      color: 'primary',
      show: false,
      closeIcon: mdiClose,
    }
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'ui/showMessage') {
        this.message = state.ui.snackbarMessage
        this.color = state.ui.snackbarColor
        this.show = true
      }
    })
  },
}
</script>
<template>
  <v-snackbar v-model="show" :color="color" :timeout="3000" top>
    {{ message }}
    <template #action="{ attrs }">
      <v-btn icon v-bind="attrs" @click="show = false">
        <v-icon>{{ closeIcon }}</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
