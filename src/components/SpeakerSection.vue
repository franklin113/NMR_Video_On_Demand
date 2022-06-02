<template>
  <div class="speakers-component">
    <div class="speaker-section-title">Speakers:</div>
    <a
      v-for="(item, index) in speakersComputed"
      :key="index"
      :[getHasHref(item)]="formatDirectoryUrl(item)"
      class="single-speaker"
      target="_blank"
    >
      <div class="single-speaker-div">
        {{ (item.first_name + ' ' + item.last_name || '') | nameFormat }}
      </div>
    </a>
  </div>
</template>

<script>
export default {
  filters: {
    nameFormat: function (value) {
      const arr = value.split(' ')
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
      }
      const str2 = arr.join(' ')
      return str2
    },
  },
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
      // console.log('format directory: ', item)
      if (item.event_attendee_id) {
        const dirUrl = `/directories/${this.directoryId}/attendee/${item.event_attendee_id}?from=/libraries/${this.libraryId}`
        return dirUrl
      } else {
        return ''
      }
    },
    getHasHref(item) {
      if (this.directoryId && item.event_attendee_id) {
        // console.log('get href: ', item)
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