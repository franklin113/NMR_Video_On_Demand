<template>
  <div id="comments-list">
    <div class="comment-info-section">
      <div id="comment-count">
        <span class="comment-count-number">{{ sortedComments ? sortedComments.length : 0 }}</span>
        <span class="comment-count-text">
          {{ sortedComments && sortedComments.length == 1 ? 'Comment' : 'Comments' }}
        </span>
      </div>
      <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none" no-caret>
        <template #button-content>
          <span class="filter-dropdown-button"><i class="far fa-sort-amount-down"></i></span>
        </template>
        <b-dropdown-item
          v-for="(item, index) in sortOptions"
          :key="index"
          :active="item.value === sortDropdownVal"
          @click="sortDropdownVal = item.value"
          >{{ item.text }}</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <SingleComment
      v-for="(comment, index) in sortedComments"
      :key="index"
      :comment="comment"
      :current-user-comment-likes="currentUserCommentLikes"
      @like="$emit('like', $event)"
    ></SingleComment>
  </div>
</template>

<script>
import SingleComment from '@/components/comment_section/SingleComment'
export default {
  components: {
    SingleComment,
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
    currentUserCommentLikes: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      sortOptions: [
        {
          text: 'Top Comments',
          value: 'ranked-asc',
        },
        {
          text: 'Newest First',
          value: 'timestamp-asc',
        },
        {
          text: 'Oldest First',
          value: 'timestamp-desc',
        },
      ],
      sortDropdownVal: 'timestamp-asc',
    }
  },
  computed: {
    sortedComments: function () {
      const copyOFComments = [...this.comments]
      if (this.sortDropdownVal === 'timestamp-asc') {
        return copyOFComments.sort((a, b) => {
          return a.timestamp > b.timestamp ? -1 : 1
        })
      } else if (this.sortDropdownVal === 'timestamp-desc') {
        return copyOFComments.sort((a, b) => {
          return a.timestamp < b.timestamp ? -1 : 1
        })
      } else if (this.sortDropdownVal === 'ranked-asc') {
        return copyOFComments.sort((a, b) => {
          return b.likes - a.likes
        })
      } else if (this.sortDropdownVal === 'ranked-desc') {
        return copyOFComments.sort((a, b) => {
          return a.likes - b.likes
        })
      } else {
        return copyOFComments
      }
    },
  },
}
</script>

<style scoped>
div#comments-list {
  display: flex;
  flex-direction: column;
}
.single-comment {
  margin-top: 1em;
  margin-bottom: 0.5em;
}
</style>
<style>
div#comments-list .btn-group > .btn {
  flex: 0 !important;
}
.comment-info-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>