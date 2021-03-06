<template>
  <b-carousel
    id="vod-caro"
    v-model="slide"
    controls
    :interval="0"
    indicators
    :background="vodConfig.slide_bg_color || defaultConfig.slide_bg_color"
    @sliding-start="onSlideStart"
    @sliding-end="onSlideEnd"
  >
    <!-- Text slides with image -->
    <b-carousel-slide v-for="(item, index) in vodItemsComputed" :key="index" :no-wrap="true">
      <div class="caro-text-region">
        <router-link
          :to="{
            name: VIDEO_PLAYER_ROUTE_NAME,
            query: {
              id: item.id,
            },
          }"
        >
          <div class="caro-caption">
            <div class="caro-title-section">
              <h2 class="caro-text-title">
                <span class="caro-title-id">{{
                  vodConfig.video_id_display_format && item.poster_number
                    ? vodConfig.video_id_display_format.replace(/\{\{ID\}\}/, item.poster_number)
                    : ''
                }}</span>
                <span class="caro-title-text">{{ item.title }}</span>
              </h2>
            </div>
            <div class="caro-short-desc">
              <p class="caro-text-short-desc">{{ item.short_description || '' }}</p>
            </div>
          </div>
        </router-link>
        <SpeakerSection
          v-if="vodConfig.speakerEnabled && item.speakers"
          class="video-item-speaker-section"
          :speakers="item.speakers"
          :directory-id="vodConfig.directoryId.toString() || ''"
          :library-id="vodConfig.libraryId.toString()"
        ></SpeakerSection>
      </div>
      <template #img>
        <router-link
          :to="{
            name: VIDEO_PLAYER_ROUTE_NAME,
            query: {
              id: item.id,
            },
          }"
        >
          <img
            v-if="item.thumbnail"
            class="d-block img-fluid w-100 custom-img"
            width="1024"
            height="480"
            :src="item.thumbnail"
            alt="image slot"
          />
          <!-- <img
          v-else-if="useGenericImg && item.generic_image"
          class="d-block img-fluid w-100 generic-img"
          width="1024"
          height="480"
          :src="item.generic_image"
          alt="image slot"
        /> -->
          <div
            v-else
            class="caro-item-bg d-block w-100"
            :class="[item.background_color ? 'has-bg-color' : 'default-bg-color']"
            :style="{
              backgroundColor: item.background_color || '#fff',
              height: '480px',
              backgroundSize: 'cover',
              backgroundImage:
                useGenericImg && item.generic_image ? 'url(' + item.generic_image + ')' : '',
            }"
          ></div>
        </router-link>
      </template>
    </b-carousel-slide>
  </b-carousel>
</template>

<script>
import { LIST_VIEW_ROUTE_NAME, VIDEO_PLAYER_ROUTE_NAME } from '@/router/constants'
import SpeakerSection from '@/components/SpeakerSection'

export default {
  components: {
    SpeakerSection,
  },
  props: {
    vodData: {
      type: Array,
      default: () => [],
    },
    vodConfig: {
      type: Object,
      default: () => {},
    },
    randomNumberIndexes: {
      type: Array,
      default: () => [],
    },
    genericImages: {
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
      VIDEO_PLAYER_ROUTE_NAME,
    }
  },
  computed: {
    useGenericImg: function () {
      return this.vodConfig && this.vodConfig.use_generic_images
        ? this.vodConfig.use_generic_images
        : false
    },
    vodItemsComputed: function () {
      if (!this.vodData) {
        return []
      }
      const copied = this.vodData.map((item, index) => {
        const payload = {
          ...item,
        }
        try {
          const randomNum = this.randomNumberIndexes[index]
          payload.generic_image = Object.values(this.genericImages)[randomNum].url
        } catch (err) {}
        return payload
      })

      return copied
    },
  },
  methods: {
    onSlideStart() {},
    onSlideEnd() {},
    caroClick(item) {
      this.$router.push()
    },
  },
}
</script>

<style>
.caro-caption {
  text-align: left;
}
.carousel-caption {
  width: 100%;
  background-color: #00000091;
}
.carousel-inner .carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding-top: 20px;
  color: #fff;
  text-align: center;
}
.caro-text-region {
  padding-bottom: 68px;
  padding-left: 162px;
}
.carousel-control-prev,
.carousel-control-next {
  z-index: 15;
  width: 5%;
}
</style>