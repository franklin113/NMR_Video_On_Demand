<template>
  <div id="vod-list-component">
    <div id="vod-page-title-section"></div>
    <section class="sessions-container">
      <div v-for="(cat, index) in categories" :key="index" class="vod-category-wrapper">
        <div class="vod-category-header">
          <h1 class="vod-header-text">{{ cat.title }}</h1>
        </div>
        <vod-section
          :vod_data="sorted_vod[cat.id]"
          :vod_config="vod_config"
          :active_description_id="active_description_id"
          @video-clicked="$emit('video-clicked', $event)"
          @description_clicked="$emit('description_clicked', $event)"
        ></vod-section>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: ['sorted_vod', 'categories', 'vod_config', 'active_description_id'],
}
</script>












<style lang="scss" scoped>

</style>