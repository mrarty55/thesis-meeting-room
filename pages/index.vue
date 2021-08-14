<script>
export default {
  data() {
    return {
      title: 'ໜ້າຫຼັກ',
      carouselItem: [
        `varee-cafe-1.jpg`,
        `varee-cafe-2.jpg`,
        `varee-cafe-3.jpg`,
        `varee-cafe-4.jpg`,
      ],
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-carousel cycle hide-delimiters>
          <v-carousel-item
            v-for="(item, index) of carouselItem"
            :key="index"
            :src="require(`~/assets/images/${item}`)"
          >
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>
