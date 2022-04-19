<template>
  <div id="vod-list-component">
    <div id="vod-page-title-section"></div>
    <section class="sessions-container">
      <div v-for="(cat, index) in categories" :key="index" class="vod-category-wrapper">
        <div class="vod-category-header">
          <h1 class="vod-header-text">{{ cat.title }}</h1>
        </div>
        <vod-section
          :vod-data="sortedVod[cat.id]"
          :vod-config="vodConfig"
          :active-description-id="activeDescriptionId"
          @video-clicked="$emit('video-clicked', $event)"
          @description-clicked="$emit('description_clicked', $event)"
        ></vod-section>
      </div>
    </section>
  </div>
</template>

<script>
import VodSection from '@/components/VodSection'
export default {
  components: {
    VodSection,
  },
  props: ['sortedVod', 'categories', 'vodConfig', 'activeDescriptionId'],
}
</script>












<style lang="scss" scoped>

</style>