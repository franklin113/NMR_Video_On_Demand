<template>
  <div id="comments-list">
    <SingleComment
      v-for="(comment, index) in comments"
      :key="index"
      :comment="comment"
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
    margin-bottom: .5em;
}
</style>