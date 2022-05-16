<template>
  <div id="video-player-component">
    <div class="back-button text-left" @click="back_button_clicked">
      <i class="fas fa-arrow-left"></i> Back
      <!--<router-link class="back-button-link" :to="{ name : 'list' }"> Back</router-link>-->
    </div>
    <div
      class="embed-title-wrapper"
      :style="{
        backgroundImage: randomBgImage && randomBgImage.url ? 'url(' + randomBgImage.url + ')' : '',
      }"
    >
      <div class="embed-title-wrapper-inner">
        <h1 v-if="selected_video_computed.title || title" id="player-title-text">
          {{ title || selected_video_computed.title }}
        </h1>
      </div>
    </div>
    <div class="embed-container">
      <b-embed
        ref="videoplayer"
        type="iframe"
        aspect="16by9"
        :src="selected_video_url"
        allowfullscreen
      ></b-embed>
    </div>

    <div id="vod-description">
      <SpeakerSection
        v-if="vodConfig.speakerEnabled && selected_video_computed.speakers"
        :speakers="selected_video_computed.speakers"
        :directory-id="vodConfig.directoryId.toString() || ''"
        :library-id="vodConfig.libraryId.toString()"
      ></SpeakerSection>
      <AssetSection
        v-if="vodConfig.assetsEnabled && selected_video_computed.assets"
        :assets="selected_video_computed.assets"
        :database="database"
        :vod-config="vodConfig"
      ></AssetSection>
      <div class="description-wrapper">
        <p v-if="selected_video_computed.description">{{ selected_video_computed.description }}</p>
      </div>
    </div>
    <LikeSection
      :current-user-likes="currentUserLikes"
      :video-like-counters="videoLikeCounters"
      :uid="id"
      @click="likeBtnClicked"
    ></LikeSection>
    <CommentSection
      :firestore="firestore"
      :database="database"
      :video-id="id"
      :vod-library-id="vodLibraryId"
      :user-data="userData"
      :current-user-comment-likes="currentUserCommentLikes"
      :liked-comments-ref="likedCommentsRef"
    ></CommentSection>
  </div>
</template>

<script>
import vod_utils from '@/utils/vod_utils'
import LikeSection from '@/components/LikeSection'
import { LIST_VIEW_ROUTE_NAME } from '@/router/constants'
import CommentSection from '@/components/comment_section/CommentSection'
import SpeakerSection from '@/components/SpeakerSection'
import AssetSection from '@/components/AssetSection'
import event_bus from '@/event_bus/event_bus'
import getUniqueRandomNumbers from '@/utils/getUniqueRandomNumbers'

export default {
  components: {
    LikeSection,
    CommentSection,
    SpeakerSection,
    AssetSection,
  },
  props: {
    selectedVideo: {
      type: Object,
      default: () => {},
    },
    vodSessions: {
      type: Array,
      default: () => [],
    },
    currentUserLikes: {
      type: Object,
      default: () => {},
    },
    currentUserCommentLikes: {
      type: Object,
      default: () => {},
    },
    videoLikeCounters: {
      type: Object,
      default: () => {},
    },
    likedCommentsRef: {
      type: Object,
      default: () => {},
    },
    database: {
      type: Object,
      required: true,
    },
    firestore: {
      type: Object,
      required: true,
    },
    vodLibraryId: {
      type: String,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    vodConfig: {
      type: Object,
      required: true,
    },
    genericImages: {
      type: Object,
      default: () => {},
    },
    numGenericImages: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      title: '',
      subtitle: '',
      id: null,
      randomBgImage: '',
      ranNum: 0,
    }
  },
  computed: {
    selected_video_computed() {
      if (Object.keys(this.selectedVideo).length > 0) {
        return this.selectedVideo
      } else {
        let self = this
        const selected = this.vodSessions.find((item) => {
          if (item.id == self.id) {
            return true
          } else {
            return false
          }
        })
        return selected || {}
      }
    },
    selected_video_url() {
      if (this.$route.query.vimeo_id) {
        return 'https://player.vimeo.com/video/' + this.$route.query.vimeo_id
      } else if (this.$route.query.video_url) {
        return this.$route.query.video_url
      } else if (this.$route.query.id != null) {
        // this.id = this.$route.query.id
        return this.selected_video_computed.video_url
      } else {
        return ''
      }
    },
  },
  watch: {
    numGenericImages: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (!this.randomBgImage && newValue) {
          this.getRandomImage()
        }
      },
    },
  },
  created() {
    if (this.$route.query.vimeo_id) {
      this.id = this.$route.query.vimeo_id
    } else if (this.$route.query.id != null) {
      this.id = this.$route.query.id
    }
  },
  mounted() {
    let self = this
    if (this.$route.query.title) {
      this.title = this.$route.query.title
    }
    if (this.$route.query.subtitle) {
      this.subtitle = this.$route.query.subtitle
    }
    try {
      console.log('seting up video player analytics')
      let count = 0
      const vimeoInterval = setInterval(() => {
        console.log('interval')
        let iframe = $(self.$refs.videoplayer).find('iframe')
        if (iframe.length > 0 && self.selected_video_url) {
          console
          self.setup_vimeo_player()
          clearInterval(vimeoInterval)
        } else {
          if (count > 10) {
            clearInterval(vimeoInterval)
          }
        }
        count++
      }, 500)
    } catch (error) {
      console.log(error)
    }

    this.getRandomImage()
  },
  methods: {
    setup_vimeo_player() {
      const video_url = this.selected_video_url
      console.log(video_url)

      let iframe = $(this.$refs.videoplayer).find('iframe')
      vod_utils.setup_vimeo_player({
        iframe,
        url: window.location.href,
        title: this.selected_video_computed.title,
        video_url: this.selected_video_computed.video_url,
      })
    },
    back_button_clicked() {
      this.$router.push({ name: LIST_VIEW_ROUTE_NAME })
    },
    likeBtnClicked(event) {
      event_bus.$emit('like-btn-clicked', event)
    },
    getRandomImage() {
      if (this.numGenericImages > 0) {
        this.ranNum = getUniqueRandomNumbers(1, 0, this.numGenericImages)
        this.randomBgImage = Object.values(this.genericImages)[this.ranNum[0]]
      }
    },
  },
}
</script>

<style  scoped>
#assets-component {
  text-align: left;
}

#vod-description {
  padding: 0em;
}

.description-wrapper {
  text-align: left;
}
.back-button {
  display: inline-block;
  cursor: pointer;
}
#player-title-text {
  color: #fff;
}
.embed-title-wrapper-inner {
  background-color: #00000078;
}
</style>