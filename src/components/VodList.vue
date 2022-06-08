<template>
  <div id="vod-list-component">
    <div id="vod-page-title-section"></div>
    <div id="filter-section">
      <TagsControl :vod-items="vodSessions" @selected-tags-changed="tagsChanged"></TagsControl>
      <div class="search-wrapper">
        <b-input-group>
          <b-form-input
            v-model="searchText"
            size="md"
            placeholder="Search"
            name="query"
            @keyup.esc="searchText = ''"
          />
          <b-input-group-append>
            <b-button size="sm">Search</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <div v-if="vodConfig.featuredVideosSectionTitle" class="vod-category-header">
      <h1 class="vod-header-text">{{ vodConfig.featuredVideosSectionTitle }}</h1>
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
    <VideoSwiper
      v-else-if="showFeaturedItems && vodConfig.featuredVideosSection == 'slider'"
      :vod-data="featuredItems"
      :vod-config="vodConfig"
      :active-description-id="activeDescriptionId"
      :current-user-likes="currentUserLikes"
      :video-like-counters="videoLikeCounters"
    ></VideoSwiper>
    <section class="sessions-container">
      <div
        v-for="(cat, index) in categories"
        :key="index"
        class="vod-category-wrapper"
        :class="cat.id"
      >
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
import vod_utils from '@/utils/vod_utils'

export default {
  components: {
    VodSection,
    CarouselList,
    VideoSwiper,
    TagsControl,
  },
  props: {
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
    topVideos: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchText: '',
      selectedTags: [],
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
      } else if (this.vodConfig.featuredVideosSectionQuery == 'likes') {
        const sortedByLikes = [...this.vodSessions]
        sortedByLikes.sort((a, b) => {
          return this.videoLikeCounters[b.id] - this.videoLikeCounters[a.id]
        })
        return sortedByLikes.slice(0, this.vodConfig.featuredVideosSectionCount || 5)
      } else {
        return []
      }
    },
    sortedVod: function () {
      const cleanup = (str) => str.toLowerCase().trim()
      const matchSpeakers = (item, str) => {
        if (
          item.speakers &&
          Object.values(item.speakers).findIndex(
            (sp) =>
              cleanup(sp.first_name).includes(str) ||
              cleanup(sp.last_name).includes(str) ||
              cleanup(sp.email).includes(str)
          ) > -1
        ) {
          return true
        } else {
          return false
        }
      }

      let copy_of_original_videos = this.vodSessions // add a slice if we are sorting the original, we aren't yet

      let searchFiltered = copy_of_original_videos.filter((item) => {
        if (!item.tags || this.selectedTags.length == 0) {
          return true
        }
        const tags = item.tags || []
        const tagsMatch = Object.keys(tags).some((r) =>
          this.selectedTags.includes(decodeURIComponent(r))
        )
        return tagsMatch
      })
      searchFiltered = searchFiltered.filter((item) => {
        if (
          !this.searchText ||
          item.id.toLowerCase().trim().includes(this.searchText.toLowerCase().trim()) ||
          item.title.toLowerCase().trim().includes(this.searchText.toLowerCase().trim()) ||
          item.description.toLowerCase().trim().includes(this.searchText.toLowerCase().trim()) ||
          item.poster_number.toLowerCase().trim().includes(this.searchText.toLowerCase().trim()) ||
          matchSpeakers(item, this.searchText.toLowerCase().trim())
        ) {
          return true
        }
      })
      //100 and hour
      searchFiltered = searchFiltered.filter((item) => {
        let is_valid = false

        let permissions_arr = Object.keys(item.permissions || {})
        if (
          permissions_arr.length == 0 ||
          permissions_arr.includes(this.userType) ||
          this.userType == '' ||
          this.userType == 'admin'
        ) {
          is_valid = true
        }

        if (item.show === false) {
          is_valid = false
        }
        return is_valid
      })
      searchFiltered.sort((a, b) => (a.title > b.title ? 1 : -1))
      searchFiltered.sort((a, b) => a.idx - b.idx)
      const grouped_vod = vod_utils.group_by(searchFiltered, 'category')
      if (this.vodConfig.leaderboardEnabled) {
        grouped_vod.leaderboard = this.topVideos
      }
      return grouped_vod
    },
    categories: function () {
      const self = this
      const filtered_cats =
        this.vodConfig && this.vodConfig.categories
          ? Object.values(this.vodConfig.categories).filter((cat) => cat.id in self.sortedVod)
          : []
      if (this.vodConfig.leaderboardEnabled) {
        filtered_cats.unshift({
          id: 'leaderboard',
          title: this.vodConfig.leaderboardTitle || 'Top Videos',
        })
      }
      return filtered_cats
    },
  },
  methods: {
    tagsChanged(evt) {
      console.log(evt)
      this.selectedTags = evt
    },
  },
}
</script>

<style scoped>
#filter-section {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
}
.search-wrapper {
  padding-top: 0.7em;
}
</style>