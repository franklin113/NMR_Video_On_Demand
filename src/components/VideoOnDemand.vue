<template>
  <main id="app">
    <transition name="routerFade" mode="out-in">
      <VodList
        :ref="$route.name"
        :sorted-vod="sorted_vod"
        :vod-config="vod_config"
        :categories="categories"
        :selected-video="selectedVideo"
        :vod-sessions="vodSessions"
        :active-description_id="active_description_id"
        @description-clicked="description_clicked"
        @video-clicked="video_clicked"
      ></VodList>
      <!-- <router-view
        :ref="$route.name"
        :sorted_vod="sorted_vod"
        :vod_config="vod_config"
        :categories="categories"
        :selectedVideo="selectedVideo"
        :vodSessions="vodSessions"
        :active_description_id="active_description_id"
        @description_clicked="description_clicked"
        @video-clicked="video_clicked"
      ></router-view> -->
    </transition>
    <div id="vod-footer">
      <p class="vod-footer-text">
        {{ vod_config.footer_text || '' }}
      </p>
    </div>
    <b-modal
      v-if="vod_config.modal_player"
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
export default {
  components: {
    VodList,
  },
  props: {
    database: {
      type: Object,
      default: () => {},
    },
    vodLibraryId: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      vodSessions: [],
      selectedVideo: {},
      user_type: vod_utils.user_data.user_type || '',
      vod_config: {},
      active_description_id: '',
    }
  },
  computed: {
    sorted_vod: function () {
      let copy_of_original_videos = this.vodSessions // add a slice if we are sorting the original, we aren't yet

      copy_of_original_videos = copy_of_original_videos.filter((item) => {
        let is_valid = false

        let permissions_arr = vod_utils.create_comma_seperated_arr(item.permissions || '')
        if (
          permissions_arr.length == 0 ||
          permissions_arr.includes(this.user_type) ||
          this.user_type == ''
        ) {
          is_valid = true
        }

        if (item.idx == -100) {
          is_valid = false
        }
        return is_valid
      })

      const grouped_vod = vod_utils.group_by(copy_of_original_videos, 'category')
      return grouped_vod
    },
    categories: function () {
      const self = this
      const filtered_cats =
        this.vod_config && this.vod_config.categories
          ? this.vod_config.categories.filter((cat) => cat.id in self.sorted_vod)
          : []
      return filtered_cats
    },
    currentRouteName() {
      return this.$route.name
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
    const parent_vod_ref = this.database.ref('vod_libraries').child(final_id)
    const vod_ref = parent_vod_ref.child('vod_library').orderByChild('idx')
    const vod_config_ref = parent_vod_ref.child('vod_library_config')

    let self = this

    vod_ref.on('child_added', (data) => {
      let new_item = data.val()
      self.handle_child_added(self.vodSessions, new_item)
    })

    vod_ref.on('child_changed', (data) => {
      let new_item = data.val()
      self.handle_child_changed(self.vodSessions, new_item)
    })

    vod_ref.on('child_removed', (data) => {
      let new_item = data.val()
      self.handle_child_removed(self.vodSessions, new_item)
    })

    vod_utils.add_listener(vod_config_ref, (val) => {
      self.vod_config = val != null ? val : {}
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
      if (this.vod_config.modal_player == true) {
        this.showModal()
        this.setup_vimeo_player()
      } else {
        this.$router.push({
          name: videoPlayerRouteName,
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
      if (this.active_description_id === id) {
        this.active_description_id = ''
      } else {
        this.active_description_id = id
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>