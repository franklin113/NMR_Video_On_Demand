<template>
  <div id="video-player-component">
    <div class="back-button text-left" @click="back_button_clicked">
      <i class="fas fa-arrow-left"></i> Back
      <!--<router-link class="back-button-link" :to="{ name : 'list' }"> Back</router-link>-->
    </div>
    <h1 v-if="selected_video_computed.title || title">
      {{ title || selected_video_computed.title }}
    </h1>
    <b-embed
      ref="videoplayer"
      type="iframe"
      aspect="16by9"
      :src="selected_video_url"
      allowfullscreen
    ></b-embed>

    <div id="vod-description">
      <p v-if="selected_video_computed.description">{{ selected_video_computed.description }}</p>
    </div>
    <LikeSection
      :current-user-likes="currentUserLikes"
      :video-like-counters="videoLikeCounters"
      :uid="id"
      @click="$emit('like-btn-clicked', $event)"
    ></LikeSection>
  </div>
</template>

<script>
import vod_utils from '@/utils/vod_utils'
import LikeSection from '@/components/LikeSection'

export default {
  components: {
    LikeSection,
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
    videoLikeCounters: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      title: '',
      subtitle: '',
      id: null,
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
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>

</style>