<template>
  <main id="app">
    <transition tag="div" name="fade" mode="out-in">
      <component
        :is="activeComponentName"
        :firestore="firestore"
        :database="database"
        :sorted-vod="sortedVod"
        :vod-config="vodConfig"
        :categories="categories"
        :selected-video="selectedVideo"
        :vod-sessions="vodSessions"
        :active-description-id="activeDescriptionId"
        :current-user-likes="currentUserLikes"
        :video-like-counters="videoLikeCounters"
        :class="vodConfig.playerClasses || ''"
        :vod-library-id="vodLibraryId"
        :user-data="userData"
        @description-clicked="description_clicked"
        @video-clicked="video_clicked"
        @like-btn-clicked="likeButtonClicked"
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
  </main>
</template>

<script>
import vod_utils from '@/utils/vod_utils'
import VodList from '@/components/VodList'
import VodPlayer from '@/components/VodPlayer'
import { LIST_VIEW_ROUTE_NAME, VIDEO_PLAYER_ROUTE_NAME } from '@/router/constants'
import { omit } from 'lodash'
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
      likedVideosRef: null,
      videoLikeCountersRef: null,
      videoLikeCounters: {},
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
        console.log(item)
        return this.vodSessions.find((v) => v.id == item[0])
      })
      return topItems
    },
    sortedVod: function () {
      let copy_of_original_videos = this.vodSessions // add a slice if we are sorting the original, we aren't yet

      copy_of_original_videos = copy_of_original_videos.filter((item) => {
        let is_valid = false

        let permissions_arr = vod_utils.create_comma_seperated_arr(item.permissions || '')
        if (
          permissions_arr.length == 0 ||
          permissions_arr.includes(this.userType) ||
          this.userType == '' ||
          this.userType == 'admin'
        ) {
          is_valid = true
        }

        if (item.idx == -100) {
          is_valid = false
        }
        return is_valid
      })

      const grouped_vod = vod_utils.group_by(copy_of_original_videos, 'category')
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
    const vod_ref = parent_vod_ref.child('videos').child(final_id)
    const vodConfig_ref = parent_vod_ref.child('configs').child(final_id)
    this.likedVideosRef = parent_vod_ref.child('user-video-likes').child(this.userData.id)
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

    // add the logo to the navbar
    $('#webNavigationTop').prepend(`<div class="mckesson-demand-header-logo"></div>`)
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
        this.$router.push({
          name: VIDEO_PLAYER_ROUTE_NAME,
          query: {
            id: this.selectedVideo.id,
          },
        })
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