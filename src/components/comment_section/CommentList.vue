<template>
  <div id="comments-list">
    <div v-for="(comment, index) in comments" :key="index" class="single-comment">
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
  </div>
</template>

<script>
export default {
  props: {
    comments: {
      type: Array,
      required: true,
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

</style>