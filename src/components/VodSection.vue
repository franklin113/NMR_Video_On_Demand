<template>
  <div class="vod-category">
    <section
      v-for="(session, index) in vodData"
      :key="index"
      class="session-container"
      :class="[session.video_url ? 'has-video-url' : 'no-video-url']"
    >
      <!-- <a
        class="video-click-region"
        :[getHref(session)]="session.video_url"
        target="_Blank"
        
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
            @click="$emit('like-btn-clicked', $event)"
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
              @toggle="$emit('description_clicked', session.id)"
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
      </div> -->
      <VideoItem
        :session="session"
        :index="index"
        :vod-config="vodConfig"
        :current-user-likes="currentUserLikes"
        :video-like-counters="videoLikeCounters"
        :active-description-id="activeDescriptionId"
      ></VideoItem>
    </section>
  </div>
</template>

<script>
import VideoItem from '@/components/VideoItem'
export default {
  components: {
    VideoItem,
  },
  props: {
    vodData: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },

    activeDescriptionId: {
      type: String,
      default: '',
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

<style scoped>
.vod-category {
  display: flex;
  justify-content: space-evenly;
}

/* .like-section {
  position: absolute;
  right: 0;
  top: 0;
} */
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
}
h2.session-title {
  color: #000;
}
section.session-container {
  margin: 1em;
}
</style>