<template>
  <div id="vod-list-component">
    <div id="vod-page-title-section"></div>
    <CarouselList
      v-if="showFeaturedItems && vodConfig.featuredVideosSection == 'carousel'"
      :vod-data="featuredItems"
      :vod-config="vodConfig"
      :active-description-id="activeDescriptionId"
      :current-user-likes="currentUserLikes"
      :video-like-counters="videoLikeCounters"
    ></CarouselList>
    <section class="sessions-container">
      <div v-for="(cat, index) in categories" :key="index" class="vod-category-wrapper">
        <div v-if="cat.show" class="vod-category-header">
          <h1 class="vod-header-text">{{ cat.title }}</h1>
        </div>
        <vod-section
          v-if="vodConfig && vodConfig.listViewStyle == 'grid'"
          :vod-data="sortedVod[cat.id]"
          :vod-config="vodConfig"
          :active-description-id="activeDescriptionId"
          :current-user-likes="currentUserLikes"
          :video-like-counters="videoLikeCounters"
        ></vod-section>
        <CarouselList
          v-else-if="vodConfig && vodConfig.listViewStyle == 'carousel'"
          :vod-data="sortedVod[cat.id]"
          :vod-config="vodConfig"
          :active-description-id="activeDescriptionId"
          :current-user-likes="currentUserLikes"
          :video-like-counters="videoLikeCounters"
        ></CarouselList>
        <VideoSwiper
          v-else-if="vodConfig && vodConfig.listViewStyle == 'slider'"
          :vod-data="sortedVod[cat.id]"
          :vod-config="vodConfig"
          :active-description-id="activeDescriptionId"
          :current-user-likes="currentUserLikes"
          :video-like-counters="videoLikeCounters"
        ></VideoSwiper>
      </div>
    </section>
  </div>
</template>

<script>
import CarouselList from '@/components/CarouselList'
import VodSection from '@/components/VodSection'
import VideoSwiper from '@/components/VideoSwiper'
import getUniqueRandomNumbers from '@/utils/getUniqueRandomNumbers'
export default {
  components: {
    VodSection,
    CarouselList,
    VideoSwiper,
  },
  props: {
    sortedVod: {
      type: Object,
      default: () => {},
    },
    categories: {
      type: Array,
      default: () => [],
    },
    vodConfig: {
      type: Object,
      default: () => {},
    },
    activeDescriptionId: {
      type: String,
      default: '',
    },
    currentUserLikes: {
      type: Object,
      default: () => {},
    },
    videoLikeCounters: {
      type: Object,
      default: () => {},
    },
    vodSessions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    showFeaturedItems() {
      if (
        this.vodConfig &&
        (this.vodConfig.featuredVideosSection === 'off' || !this.vodConfig.featuredVideosSection)
      ) {
        return false
      } else {
        return true
      }
    },
    featuredItems() {
      if (this.vodConfig.featuredVideosSectionQuery == 'random') {
        const uniqueNums = getUniqueRandomNumbers(
          this.vodConfig.featuredVideosSectionCount || 5,
          0,
          this.vodSessions.length
        )
        const uniqueVideos = uniqueNums.map((item) => this.vodSessions[item])
        return uniqueVideos
      } else {
        return []
      }
    },
  },
}
</script>

<style scoped>

</style>