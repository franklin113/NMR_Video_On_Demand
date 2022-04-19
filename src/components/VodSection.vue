<template>
  <div class="vod-category">
    <section
      v-for="(session, index) in vod_data"
      :key="index"
      class="session-container"
      :class="[session.video_url ? 'has-video-url' : 'no-video-url']"
    >
      <a
        class="video-click-region"
        :[getHref(session)]="session.video_url"
        target="_Blank"
        @click="onVideoClick(session, index)"
      >
        <span style="display: none" class="t-span">video-click</span>
        <div class="session-thumb-container">
          <div v-if="vod_config.video_overlay_text && !session.video_url" class="video-overlay">
            <p class="video-overlay-text">{{ vod_config.video_overlay_text || '' }}</p>
          </div>
          <div
            v-if="vod_config.thumbnail_tag === 'div'"
            :style="{ backgroundImage: 'url(' + session.thumb_with_play_button + ')' }"
            class="thumbnail-container"
          ></div>
          <img
            v-else-if="vod_config.thumbnail_tag === 'img' || !vod_config.thumbnail_tag"
            :src="session.thumb_with_play_button"
            alt="img"
            style="width: 100%; height: auto"
          />
        </div>
        <h2 class="session-title">{{ session.title }}</h2>
      </a>
      <div class="video-description-wrapper">
        <p class="session-description">
          <transition>
            <truncate
              :truncated="false"
              :show="active_description_id === session.id"
              collapsed-text-class="collapsed-text"
              class="expended-text"
              :clamp="vod_config.desc_show_more_text"
              :length="vod_config.desc_truncate_length"
              :less="vod_config.desc_show_less_text"
              :text="session.description || ''"
              @toggle="$emit('description_clicked', session.id)"
            ></truncate>
          </transition>
        </p>
      </div>
      <div class="resources-section d-flex flex-wrap">
        <div
          v-for="(resource, resource_index) in session.resources"
          :key="resource_index"
          class="resource-item"
        >
          <a class="resource-link btn btn-secondary" target="_Blank" :href="resource.link">
            {{ resource.display_name }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
    truncate,
  },
  props: {
    vod_data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    active_description_id: {
      type: String | Number,
      default: '',
    },
    vod_config: {
      type: Object,
      default: () => {},
    },
  },
  computed: {},
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
    getHref(session) {
      return session.open_in_new_tab ? 'href' : null
    },
  },
}
</script>












<style lang="scss" scoped>

</style>