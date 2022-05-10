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
          :style="imgStyles"
          class="thumbnail-container"
        >
          <div
            v-show="vodConfig.titlePosition === 'overlay'"
            class="video-title-section title-overlay"
          >
            <h2 class="session-title">
              {{ session.title }}
            </h2>
            <LikeSection
              :current-user-likes="currentUserLikes"
              :video-like-counters="videoLikeCounters"
              :uid="session.id.toString()"
              @click="likeBtnClicked"
            ></LikeSection>
          </div>
        </div>
        <img
          v-else-if="vodConfig.thumbnail_tag === 'img' || !vodConfig.thumbnail_tag"
          :src="session.thumbnail"
          alt="img"
          style="width: 100%; height: auto"
        />
      </div>
      <div v-if="vodConfig.titlePosition === 'title_section'" class="video-title-section">
        <h2 class="session-title">
          {{ session.title }}
        </h2>
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
            class="expended-text video-item-text-trunc"
            :clamp="vodConfig.desc_show_more_text"
            :length="vodConfig.desc_truncate_length"
            :less="vodConfig.desc_show_less_text"
            :text="session.description || ''"
            @toggle="descriptionClicked(session.id)"
          ></truncate-text>
        </transition>
      </p>
      <SpeakerSection
        v-if="vodConfig.speakerEnabled && session.speakers"
        class="video-item-speaker-section"
        :speakers="session.speakers"
        :directory-id="vodConfig.directoryId.toString() || ''"
        :library-id="vodConfig.libraryId.toString()"
      ></SpeakerSection>
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
    <div v-if="vodConfig.showMoreText" class="show-more-section">
      <a
        class="show-more-a-tag"
        :[getHref(session)]="session.video_url"
        target="_Blank"
        @click="videoClicked(session, index)"
        >{{ vodConfig.showMoreText }}</a
      >
    </div>
  </div>
</template>

<script>
import TruncateText from '@/components/TruncateText'
import LikeSection from '@/components/LikeSection'
import event_bus from '@/event_bus/event_bus'
import SpeakerSection from '@/components/SpeakerSection'
export default {
  components: {
    TruncateText,
    LikeSection,
    SpeakerSection,
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
    imgStyles: function () {
      const style = {}
      if (this.session.thumbnail) {
        style.backgroundImage = `url(${this.session.thumbnail})`
      }
      if (this.session.background_color) {
        style.backgroundColor = this.session.background_color
      }
      return style
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
.single-vod-item {
  background-size: cover;
}
.video-title-section {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.single-vod-item {
  background-color: #e4e4e4;
  border-radius: 1em;
  -webkit-box-shadow: -1px 2px 13px -3px rgba(0, 0, 0, 0.47);
  box-shadow: -1px 2px 13px -3px rgba(0, 0, 0, 0.47);
  transition: all 0.3s;
}
.single-vod-item:hover {
  -webkit-box-shadow: -1px 2px 13px 3px rgba(0, 0, 0, 0.47);
  box-shadow: -1px 2px 13px 3px rgba(0, 0, 0, 0.47);
}
.thumbnail-container {
  height: 150px;
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
}
.video-title-section.title-overlay {
  width: 100%;
  padding: 1em;
}
.video-item-speaker-section {
  text-align: left;
  padding-left: 1em;
  padding-bottom: 1em;
}
.video-item-text-trunc {
  text-align: left;
  padding-left: 1em;
  padding-top: 0.5em;
}
.video-click-region {
  cursor: pointer;
}
.show-more-section {
  text-align: left;
  padding-left: 1em;
  padding-bottom: 1em;
}
.show-more-section a {
  cursor: pointer;
}
</style>