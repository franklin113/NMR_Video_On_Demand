<template>
  <div id="speakers-component">
    <a
      v-for="(item, index) in speakersComputed"
      :key="index"
      :[getHasHref(item)]="formatDirectoryUrl(item)"
      class="single-speaker"
    >
      <div class="single-speaker-div">{{ item.first_name + ' ' + item.last_name || '' }}</div>
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
    libraryId: {
      type: String,
      required: true,
    },
  },

  computed: {
    speakersComputed: function () {
      if (!this.speakers) {
        return []
      }
      const copied = [...Object.values(this.speakers)]
      copied.sort((a, b) => (a.idx || 0) - (b.idx || 0))

      return copied
    },
  },
  methods: {
    formatDirectoryUrl(item) {
      console.log('format directory: ', item)
      if (item.attendee_id) {
        const dirUrl = `/directories/${this.directoryId}/${item.attendee_id}?from=libraries/${this.libraryId}`
        return dirUrl
      } else {
        return ''
      }
    },
    getHasHref(item) {
      if (this.directoryId && item.attendee_id) {
        console.log('get href: ', item)
        return 'href'
      } else {
        return null
      }
    },
  },
}
</script>

<style  scoped>

</style>