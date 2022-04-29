<template>
  <div id="assets-component">
    <a v-for="(item, index) in assetsComputed" :key="index" class="single-asset">
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
  },
  computed: {
    assetsComputed: function () {
      const copied = [...Object.values(this.assets)]
      copied.sort((a, b) => (a.title < b.title ? -1 : 1))
      copied.sort((a, b) => (a.idx || 0) - (b.idx || 0))

      return copied
    },
  },
}
</script>

<style scoped>

</style>