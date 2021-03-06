<template>
  <div id="vod-component-main">
    <transition tag="div" name="fade" mode="out-in">
      <component
        :is="activeComponentName"
        :firestore="firestore"
        :database="database"
        :vod-config="vodConfig"
        :selected-video="selectedVideo"
        :vod-sessions="vodSessions"
        :active-description-id="activeDescriptionId"
        :current-user-likes="currentUserLikes"
        :current-user-comment-likes="currentUserCommentLikes"
        :video-like-counters="videoLikeCounters"
        :liked-comments-ref="likedCommentsRef"
        :class="vodConfig.playerClasses || ''"
        :vod-library-id="vodLibraryId"
        :user-data="userData"
        :random-number-indexes="randomGenericImagesIndexes"
        :generic-images="genericImages"
        :num-generic-images="numGenericImages"
        :top-videos="topVideos"
      ></component>
    </transition>
    <div id="vod-footer">
      <p class="vod-footer-text">
        {{ vodConfig.footer_text || '' }}
      </p>
    </div>
    <b-modal
      v-if="vodConfig.modal_player"
      ref="vod_modal"
      size="xl"
      :title="selectedVideo.title ? selectedVideo.title : ''"
      ok-only
      :no-close-on-backdrop="true"
    >
      <b-embed
        ref="videoplayer"
        type="iframe"
        aspect="16by9"
        :src="selectedVideo.video_url"
        allowfullscreen
      ></b-embed>
    </b-modal>
  </div>
</template>

<script>
import vod_utils from '@/utils/vod_utils'
import VodList from '@/components/VodList'
import VodPlayer from '@/components/VodPlayer'
import { LIST_VIEW_ROUTE_NAME, VIDEO_PLAYER_ROUTE_NAME } from '@/router/constants'
import { omit } from 'lodash'
import event_bus from '@/event_bus/event_bus'
import getUniqueRandomNumbers from '@/utils/getUniqueRandomNumbers'
export default {
  name: 'VideoOnDemand',
  components: {
    VodList,
    VodPlayer,
  },
  props: {
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
  },
  data: function () {
    return {
      vodSessions: [],
      selectedVideo: {},
      vodConfig: {},
      activeDescriptionId: '',
      LIST_VIEW_ROUTE_NAME,
      VIDEO_PLAYER_ROUTE_NAME,
      currentUserLikes: {},
      currentUserCommentLikes: {},
      likedVideosRef: null,
      likedCommentsRef: null,
      videoLikeCountersRef: null,
      videoLikeCounters: {},
      genericImages: {},
      genericImagesRef: null,
      numGenericImages: 0,
      randomGenericImagesIndexes: null,
    }
  },
  computed: {
    topVideos: function () {
      const counters = Object.entries(this.videoLikeCounters)
        .filter((item) => item[1] > 0 && this.vodSessions.find((v) => v.id == item[0]))
        .sort((a, b) => b[1] - a[1])
      const numItems = this.vodConfig.leaderboardCount || 0
      const topX = counters.length > numItems ? counters.slice(0, numItems) : counters
      const topItems = topX.map((item) => {
        return this.vodSessions.find((v) => v.id == item[0])
      })
      return topItems
    },

    currentRouteName() {
      return this.$route.name
    },
    userType: function () {
      return this.userData.userType || 'guest'
    },
    vodMode: function () {
      if (this.currentRouteName == LIST_VIEW_ROUTE_NAME) {
        return LIST_VIEW_ROUTE_NAME
      } else if (this.currentRouteName == VIDEO_PLAYER_ROUTE_NAME) {
        return VIDEO_PLAYER_ROUTE_NAME
      } else {
        return null
      }
    },
    activeComponentName: function () {
      if (this.vodMode === LIST_VIEW_ROUTE_NAME) {
        return 'VodList'
      } else if (this.vodMode === VIDEO_PLAYER_ROUTE_NAME) {
        return 'VodPlayer'
      } else {
        return ''
      }
    },
  },
  mounted() {
    // const library_id = vod_utils.keyify(window.location.pathname.split('/').slice(-1)[0])
    let final_id
    if (this.$route.query.library_id != null) {
      final_id = this.$route.query.library_id
    } else if (this.vodLibraryId) {
      final_id = this.vodLibraryId
    } else {
      final_id = null
    }
    const parent_vod_ref = this.database.ref('vod_libraries')
    this.genericImagesRef = this.database.ref('vod_libraries').child('generic_images')
    const vod_ref = parent_vod_ref.child('videos').child(final_id)
    const vodConfig_ref = parent_vod_ref.child('configs').child(final_id)
    this.likedVideosRef = parent_vod_ref.child('user-video-likes').child(this.userData.attendeeId)
    this.likedCommentsRef = parent_vod_ref
      .child('user-comment-likes')
      .child(this.userData.attendeeId)
    this.videoLikeCountersRef = parent_vod_ref.child('video-like-counters').child(final_id)
    let self = this

    // * video on demand videos
    vod_ref.on('child_added', (data) => {
      let new_item = data.val()

      new_item.id = new_item.id ? new_item.id.toString() : ''
      self.handle_child_added(self.vodSessions, new_item)
    })

    vod_ref.on('child_changed', (data) => {
      let new_item = data.val()
      new_item.id = new_item.id ? new_item.id.toString() : ''
      self.handle_child_changed(self.vodSessions, new_item)
    })

    vod_ref.on('child_removed', (data) => {
      let new_item = data.val()
      self.handle_child_removed(self.vodSessions, new_item)
    })

    // * user's own likes
    this.likedVideosRef.on('child_added', (data) => {
      let new_item = data.val()
      self.currentUserLikes = Object.assign({}, self.currentUserLikes, {
        [data.key]: new_item,
      })
    })

    this.likedVideosRef.on('child_changed', (data) => {
      let new_item = data.val()
      self.currentUserLikes = Object.assign({}, self.currentUserLikes, {
        [data.key]: new_item,
      })
    })

    this.likedVideosRef.on('child_removed', (data) => {
      self.currentUserLikes = omit(self.currentUserLikes, data.key)
    })

    // * user's own likes on comments
    this.likedCommentsRef.on('child_added', (data) => {
      let new_item = data.val()
      self.currentUserCommentLikes = Object.assign({}, self.currentUserCommentLikes, {
        [data.key]: new_item,
      })
    })

    this.likedCommentsRef.on('child_changed', (data) => {
      let new_item = data.val()
      self.currentUserCommentLikes = Object.assign({}, self.currentUserCommentLikes, {
        [data.key]: new_item,
      })
    })

    this.likedCommentsRef.on('child_removed', (data) => {
      self.currentUserCommentLikes = omit(self.currentUserCommentLikes, data.key)
    })

    // * video like counters
    this.videoLikeCountersRef.on('child_added', (data) => {
      let new_item = data.val()
      self.videoLikeCounters = Object.assign({}, self.videoLikeCounters, {
        [data.key]: new_item,
      })
    })

    this.videoLikeCountersRef.on('child_changed', (data) => {
      let new_item = data.val()
      self.videoLikeCounters = Object.assign({}, self.videoLikeCounters, {
        [data.key]: new_item,
      })
    })

    this.videoLikeCountersRef.on('child_removed', (data) => {
      self.videoLikeCounters = omit(self.videoLikeCounters, data.key)
    })

    vod_utils.add_listener(vodConfig_ref, (val) => {
      self.vodConfig = val != null ? val : {}
    })
    vod_utils.add_listener(this.genericImagesRef, (val) => {
      self.genericImages = val != null ? val : {}
      self.numGenericImages = Object.keys(self.genericImages).length
      if (!self.randomGenericImagesIndexes) {
        self.randomGenericImagesIndexes = getUniqueRandomNumbers(
          this.vodConfig.featuredVideosSectionCount + 5 || 10,
          0,
          self.numGenericImages
        )
      }
    })

    event_bus.$on('like-btn-clicked', this.likeButtonClicked)
    event_bus.$on('video-clicked', this.video_clicked)
    event_bus.$on('description-clicked', this.description_clicked)
    // add the logo to the navbar
    $('#webNavigationTop').prepend(`<div class="mckesson-demand-header-logo"></div>`)
  },
  destroyed() {
    this.genericImagesRef.off('value')
  },
  methods: {
    handle_child_added(target_arr, new_item) {
      target_arr.push(new_item) //todo -- get the index this should be inserted next to
    },
    handle_child_changed(target_arr, new_item) {
      let new_item_index = vod_utils.get_index(target_arr, new_item)
      target_arr.splice(new_item_index, 1, new_item)
    },
    handle_child_removed(target_arr, old_item) {
      let new_item_index = vod_utils.get_index(target_arr, old_item)
      target_arr.splice(new_item_index, 1)
    },
    showModal() {
      this.$refs['vod_modal'].show()
    },
    hideModal() {
      this.$refs['vod_modal'].hide()
    },
    video_clicked(video_obj) {
      this.selectedVideo = Object.assign({}, video_obj)
      if (this.vodConfig.modal_player == true) {
        this.showModal()
        this.setup_vimeo_player()
      } else {
        this.$router
          .push({
            name: VIDEO_PLAYER_ROUTE_NAME,
            query: {
              id: this.selectedVideo.id,
            },
          })
          .catch((err) => err)
      }
    },
    setup_vimeo_player() {
      this.$nextTick(() => {
        let iframe = $(this.$refs.videoplayer).find('iframe')
        const url = window.location.href
        const title = this.selectedVideo.title
        const id = this.selectedVideo.id
        vod_utils.setup_vimeo_player({
          iframe,
          title,
          id,
        })
      })
    },
    description_clicked(id) {
      if (this.activeDescriptionId === id) {
        this.activeDescriptionId = ''
      } else {
        this.activeDescriptionId = id
      }
    },
    async likeButtonClicked(eventPayload) {
      let newVal = eventPayload.state || null
      let newCountIncrement = eventPayload.state ? 1 : -1
      await this.likedVideosRef.child(eventPayload.id).set(newVal)
      await this.videoLikeCountersRef.update({
        [eventPayload.id]: firebase.database.ServerValue.increment(newCountIncrement),
      })
    },
  },
}
</script>

<style  scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
/* .fade-leave-active {
  position: absolute;
} */
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>