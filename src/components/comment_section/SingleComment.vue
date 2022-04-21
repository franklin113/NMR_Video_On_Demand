<template>
  <div class="single-comment">
    <div class="left-section">
      <div class="user-initials">TF</div>
    </div>
    <div class="mid-section">
      <div class="comment-header">
        <div class="comment-author">
          {{ comment.firstName + ' ' + comment.lastName }}
        </div>
        <div class="comment-timestamp">
          {{ convertTimestamp(comment.timestamp) }}
        </div>
      </div>
      <div class="comment-body">
        {{ comment.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    convertTimestamp(val) {
      if (!val) return ''
      return val.toDate().toLocaleString()
    },
  },
}
</script>

<style scoped>
.single-comment {
  display: flex;
  flex: 1 0 100%;
}

.comment-header {
  display: flex;
}
</style>