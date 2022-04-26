<template>
  <div class="like-section" @click.stop="clicked">
    <div class="like-count">{{ likeCount }}</div>
    <div class="star-wrapper">
      <i v-if="active" class="fas fa-star"></i>
      <i v-else class="far fa-star"></i>
    </div>
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
    videoLikeCounters: {
      type: Object,
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
    likeCount: function () {
      return this.videoLikeCounters ? this.videoLikeCounters[this.uid] || 0 : 0
    },
  },
  methods: {
    clicked: debounce(function () {
      this.$emit('click', { id: this.uid, state: !this.active })
    }, 200),
  },
}
</script>

<style  scoped>
.star-wrapper {
  margin-left: 5px;
}
.like-section {
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>