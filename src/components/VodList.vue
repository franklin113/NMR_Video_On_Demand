<template>
  <div id="vod-list-component">
    <div id="vod-page-title-section"></div>
    <div id="filter-section">
      <TagsControl :vod-items="vodSessions"></TagsControl>
      <div class="search-wrapper">
        <b-form-input
          id="vod-search-input"
          v-model="text"
          placeholder="Enter your name"
        ></b-form-input>
      </div>
    </div>
    <CarouselList
      v-if="showFeaturedItems && vodConfig.featuredVideosSection == 'carousel'"
      :vod-data="featuredItems"
      :vod-config="vodConfig"
      :active-description-id="activeDescriptionId"
      :current-user-likes="currentUserLikes"
      :video-like-counters="videoLikeCounters"
      :random-number-indexes="randomNumberIndexes"
      :generic-images="genericImages"
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
          :random-number-indexes="randomNumberIndexes"
          :generic-images="genericImages"
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
import TagsControl from '@/components/TagsControl'
export default {
  components: {
    VodSection,
    CarouselList,
    VideoSwiper,
    TagsControl,
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
      searchText: '',
    }
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