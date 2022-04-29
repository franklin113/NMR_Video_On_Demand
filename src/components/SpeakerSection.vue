<template>
  <div id="speakers-component">
    <a
      v-for="(item, index) in speakersComputed"
      :key="index"
      :[getHasHref(item)]="formatDirectoryUrl(item)"
      class="single-speaker"
    >
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
    directoryId: {
      type: String,
      default: '',
    },
  },

  computed: {
    speakersComputed: function () {
      if (!this.speakers) {
        return []
      }
      const copied = [...Object.values(this.speakers)]
      copied.sort((a, b) => (a.username < b.username ? -1 : 1))
      copied.sort((a, b) => (a.idx || 0) - (b.idx || 0))

      return copied
    },
  },
  methods: {
    formatDirectoryUrl(item) {
      if (item.attendeeId) {
        const dirUrl = `/directories/${this.directoryId}/${item.attendeeId}`
        return dirUrl
      } else {
        return ''
      }
    },
    getHasHref(item) {
      if (this.directoryId && item.attendeeId) {
        return 'href'
      } else {
        return null
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>