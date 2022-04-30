<template>
  <b-carousel
    id="vod-caro"
    v-model="slide"
    controls
    indicators
    :background="vodConfig.slide_bg_color || defaultConfig.slide_bg_color"
    :img-width="vodConfig.img_width || defaultConfig.img_width"
    :img-height="vodConfig.img_height || defaultConfig.img_height"
    @sliding-start="onSlideStart"
    @sliding-end="onSlideEnd"
  >
    <!-- Text slides with image -->
    <b-carousel-slide
      v-for="(item, index) in vodItemsComputed"
      :key="index"
      :caption="item.title"
      :text="item.short_desc"
    >
      <template #img>
        <img
          class="d-block img-fluid w-100"
          width="1024"
          height="480"
          :src="item.thumbnail"
          alt="image slot"
        />
      </template>
    </b-carousel-slide>
  </b-carousel>
</template>

<script>
export default {
  props: {
    vodData: {
      type: Array,
      default: () => [],
    },
    vodConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      slide: 0,
      defaultConfig: {
        slide_bg_color: '#ababab',
        img_height: '1024',
        img_width: '480',
      },
    }
  },
  computed: {
    vodItemsComputed: function () {
      if (!this.vodData) {
        return []
      }
      // const copied = [...this.vodItems]
      // copied.sort((a, b)=>{
      //   return a
      // })
      return this.vodData
    },
  },
  methods: {
    onSlideStart() {},
    onSlideEnd() {},
  },
}
</script>

<style scoped>

</style>