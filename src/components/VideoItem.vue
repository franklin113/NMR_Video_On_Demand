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
          :style="{ backgroundImage: 'url(' + session.thumbnail + ')' }"
          class="thumbnail-container"
        ></div>
        <img
          v-else-if="vodConfig.thumbnail_tag === 'img' || !vodConfig.thumbnail_tag"
          :src="session.thumbnail"
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
    index: {
      type: Number,
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
  computed: {
    // styles: function () {
    //   return {
    //     backgroundImage: `url(${this.session.thumbnail})`,
    //     backgroundColor: '#fff',
    //     height: '250px',
    //   }
    // },
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
.single-vod-item {
  background-size: cover;
}
.video-title-section {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.session-title {
  margin-right: 30px;
  margin-left: 30px;
}
a.video-click-region:hover {
  text-decoration: none;
}
.like-section {
  color: #000;
  flex: 0 0 20%;
  max-width: 20%;
}

.session-title {
  color: #000;
}

/* swiper version */
.swiper-slide .single-vod-item {
  margin-left: 1em;
  margin-right: 1em;
}

.swiper-slide .video-title-section {
  align-items: center;
}

.swiper-slide .session-title {
  font-size: 20px;
  margin-left: 0;
  flex: 1 0 80%;
  max-width: 80%;
  text-align: left;
  margin-right: 0;
}
</style>