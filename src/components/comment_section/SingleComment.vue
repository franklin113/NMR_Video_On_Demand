<template>
  <div class="single-comment">
    <div class="single-comment-part left-section">
      <div class="user-initials">TF</div>
    </div>
    <div class="single-comment-part mid-section">
      <div class="comment-header">
        <div class="comment-author">
          {{ comment.firstName + ' ' + comment.lastName }}
        </div>
        <div class="comment-timestamp">
          {{ convertTimestamp(comment.timestamp) }}
        </div>
      </div>
      <div class="single-comment-part comment-body">
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
.single-comment-part.mid-section {
    flex: 1;
}
.single-comment-part.comment-body {
    text-align: left;
}
.single-comment-part.left-section {
    border-radius: 25px;
    background-color: red;
    width: 50px;
    color: #fff;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}
.single-comment-part.left-section {
    margin-right: 1em;
}
</style>