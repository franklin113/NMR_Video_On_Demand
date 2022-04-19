<template>
  <div @click="clicked">
    <i v-if="active" class="fas fa-star"></i>
    <i v-else class="far fa-star"></i>
  </div>
</template>

<script>
import debounce from '@/utils/debounce'

export default {
  props: {
    currentUserLikes: {
      type: Object,
      default: () => {},
    },
    uid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    active: function () {
      return this.currentUserLikes[this.uid] || false
    },
  },
  methods: {
    clicked() {
      this.$emit('click', { id: this.uid, state: !this.active })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>