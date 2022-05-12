<template>
  <swiper :modules="modules" :options="swiperOptions">
    <swiper-slide v-for="(session, index) in vodData" :key="session.id">
      <VideoItem
        :session="session"
        :index="index"
        :vod-data="vodData"
        :vod-config="vodConfig"
        :current-user-likes="currentUserLikes"
        :video-like-counters="videoLikeCounters"
        :active-description-id="activeDescriptionId"
      ></VideoItem>
    </swiper-slide>
    <div slot="pagination" class="swiper-pagination"></div>
    <div slot="button-prev" class="swiper-button-prev"></div>
    <div slot="button-next" class="swiper-button-next"></div>
  </swiper>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'

import { swiper, swiperSlide } from 'vue-awesome-swiper'

import VideoItem from '@/components/VideoItem'

export default {
  name: 'HomePage',
  components: {
    swiper,
    swiperSlide,
    VideoItem,
  },
  props: {
    vodData: {
      type: Array,
      default: () => [],
    },
    activeDescriptionId: {
      type: String,
      default: '',
    },
    vodConfig: {
      type: Object,
      default: () => {},
    },
    currentUserLikes: {
      type: Object,
      default: () => {},
    },
    videoLikeCounters: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      modules: [Navigation, Pagination, Scrollbar, A11y],

      swiperOptions: {
        slidesPerView: 3,
        spaceBetween: 0,
        freeMode: true,
        loop: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        scrollbar: {
          draggable: true,
          hide: false,
        },
      },
    }
  },
  methods: {
    onVideoClick(session) {
      // * we are opening the video in a new tab, don't do anything with this click
      if (session.open_in_new_tab) {
        return
      } else {
        // * we will actually do something with the video click
        this.$emit('video-clicked', session)
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.swiper-slide {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.swiper-container {
  height: 450px;
  width: 100%;
}
</style>
