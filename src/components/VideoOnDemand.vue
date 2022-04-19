<template>
  <main id="app">
    <transition name="routerFade" mode="out-in">
      <router-view
        :ref="$route.name"
        :sorted_vod="sorted_vod"
        :vod_config="vod_config"
        :categories="categories"
        :selected_video="selected_video"
        :vod_sessions="vod_sessions"
        :active_description_id="active_description_id"
        @description_clicked="description_clicked"
        @video-clicked="video_clicked"
      ></router-view>
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
      :title="selected_video.title ? selected_video.title : ''"
      ok-only
      :no-close-on-backdrop="true"
    >
      <b-embed
        ref="videoplayer"
        type="iframe"
        aspect="16by9"
        :src="selected_video.video_url"
        allowfullscreen
      ></b-embed>
    </b-modal>
  </main>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>

</style>