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
          {{ comment.timestamp | timeSince }}
        </div>
      </div>
      <div class="single-comment-part comment-body">
        {{ comment.text }}
      </div>
    </div>
    <div class="single-comment-right-section">
      <div class="comment-like-count">{{ comment.likes || 0 }}</div>
      <div class="comment-like-wrapper">
        <i v-show="likedComment" class="fas fa-heart" @click="likeClicked(false)"></i>
        <i v-show="!likedComment" class="far fa-heart" @click="likeClicked(true)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { timeSince } from '@/utils/time_utils'

export default {
  filters: {
    timeSince: function (val) {
      return timeSince(val.toDate())
    },
  },
  props: {
    comment: {
      type: Object,
      default: () => {},
    },
    currentUserCommentLikes: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    likedComment: function () {
      if (this.currentUserCommentLikes && this.currentUserCommentLikes[this.comment.id]) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    convertTimestamp(val) {
      if (!val) return ''
      return val.toDate().toLocaleString()
    },
    likeClicked(newState) {
      this.$emit('like', {
        id: this.comment.id,
        state: newState,
      })
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
.comment-timestamp {
  margin-left: 10px;
}
</style>