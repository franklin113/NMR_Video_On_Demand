<template>
  <div class="single-vod-item">
    <a
      class="video-click-region"
      :[getHref(session)]="session.video_url"
      target="_Blank"
      @click="videoClicked(session, index)"
    >
      <span style="display: none" class="t-span">video-click</span>
      <div class="session-thumb-container">
        <div v-if="vodConfig.video_overlay_text && !session.video_url" class="video-overlay">
          <p class="video-overlay-text">{{ vodConfig.video_overlay_text || '' }}</p>
        </div>
        <div
          v-if="vodConfig.thumbnail_tag === 'div'"
          :style="{ backgroundImage: 'url(' + session.thumb_with_play_button + ')' }"
          class="thumbnail-container"
        ></div>
        <img
          v-else-if="vodConfig.thumbnail_tag === 'img' || !vodConfig.thumbnail_tag"
          :src="session.thumb_with_play_button"
          alt="img"
          style="width: 100%; height: auto"
        />
      </div>
      <div class="video-title-section">
        <h2 class="session-title">{{ session.title }}</h2>
        <LikeSection
          :current-user-likes="currentUserLikes"
          :video-like-counters="videoLikeCounters"
          :uid="session.id.toString()"
          @click="likeBtnClicked"
        ></LikeSection>
      </div>
    </a>

    <div class="video-description-wrapper">
      <p class="session-description">
        <transition>
          <truncate-text
            :truncated="false"
            :show="activeDescriptionId === session.id"
            collapsed-text-class="collapsed-text"
            class="expended-text"
            :clamp="vodConfig.desc_show_more_text"
            :length="vodConfig.desc_truncate_length"
            :less="vodConfig.desc_show_less_text"
            :text="session.description || ''"
            @toggle="descriptionClicked(session.id)"
          ></truncate-text>
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
  </div>
</template>

<script>
import TruncateText from '@/components/TruncateText'
import LikeSection from '@/components/LikeSection'
import event_bus from '@/event_bus/event_bus'
export default {
  components: {
    TruncateText,
    LikeSection,
  },
  props: {
    session: {
      type: Object,
      required: true,
    },
    vodData: {
      type: Array,
      default: () => [],
    },
    vodConfig: {
      type: Object,
      default: () => {},
    },
    currentUserLikes: {
      type: Object,
      default: () => {},
    },
    videoLikeCounters: {
      type: Object,
      default: () => {},
    },
    activeDescriptionId: {
      type: String,
      default: '',
    },
  },
  methods: {
    getHref(session) {
      return session.open_in_new_tab ? 'href' : null
    },
    likeBtnClicked(event) {
      event_bus.$emit('like-btn-clicked', event)
    },
    videoClicked(session, index) {
      console.log('video clicked')
      event_bus.$emit('video-clicked', session, index)
    },
    descriptionClicked(event) {
      event_bus.$emit('description-clicked', event)
    },
  },
}
</script>

<style scoped>

</style>