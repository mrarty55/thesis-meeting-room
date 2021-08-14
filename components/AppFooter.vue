<script>
export default {
  props: {
    app: {
      type: Boolean,
      default: true,
    },
    absolute: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
<template>
  <v-footer :app="app" :absolute="absolute">
    <span>&copy; {{ new Date().getFullYear() }}</span>
    <span>&nbsp; ຮ້ານກາເຟວະລີ.</span>
  </v-footer>
</template>
