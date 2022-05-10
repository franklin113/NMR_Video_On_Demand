<template>
  <div id="assets-component">
    <div class="speaker-section-title">Assets:</div>
    <a
      v-for="(item, index) in assetsComputed"
      :key="index"
      class="single-asset"
      :[getHasHref(item)]="item.url"
      target="_blank"
    >
      <div class="single-asset-div">{{ item.title || 'Asset ' + index.toString() }}</div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    assets: {
      type: Object,
      default: () => {},
    },
    database: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fbRef: '/vod_libraries/assets',
      fullAssets: {},
    }
  },
  computed: {
    assetsComputed: function () {
      if (!this.fullAssets) {
        return []
      }
      const copied = [...Object.values(this.fullAssets)]
      copied.sort((a, b) => (a.title < b.title ? -1 : 1))
      copied.sort((a, b) => (a.idx || 0) - (b.idx || 0))

      return copied
    },
  },
  watch: {
    assets: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue && Object.keys(newValue).length > 0) {
          this.fetchResources()
        }
      },
    },
  },
  created() {},
  destroyed() {},
  methods: {
    async fetchResources() {
      const updateData = {}
      for (let i in this.assets) {
        const snap = await this.database.ref(this.fbRef).child(i).once('value')
        if (snap && snap.exists() && snap.val()) {
          updateData[snap.key] = snap.val()
        }
      }
      this.fullAssets = updateData
    },
    getHasHref(item) {
      if (item.url) {
        return 'href'
      } else {
        return null
      }
    },
  },
}
</script>

<style scoped>

</style>