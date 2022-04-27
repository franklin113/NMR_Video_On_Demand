<template>
  <div id="speakers-component">
    <a v-for="(item, index) in speakersComputed" :key="index" class="single-speaker">
      <div class="single-speaker-div">{{ item.username || '' }}</div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    speakers: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    speakersComputed: function () {
      const copied = [...Object.values(this.assets)]
      copied.sort((a, b) => (a.username < b.username ? -1 : 1))
      copied.sort((a, b) => (a.idx || 0) - (b.idx || 0))

      return copied
    },
  },
}
</script>

<style lang="scss" scoped>

</style>