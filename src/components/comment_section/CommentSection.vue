<template>
  <div id="comment-section">
    <CommentForm @submit="onCommentSubmit"></CommentForm>
  </div>
</template>

<script>
import CommentForm from '@/components/comment_section/CommentForm'
import Comment from '@/classes/Comment'
export default {
  components: {
    CommentForm,
  },
  props: {
    videoId: {
      type: String,
      required: true,
    },
    vodLibraryId: {
      type: String,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    database: {
      type: Object,
      required: true,
    },
    firestore: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      commentListener: null,
      comments: [],
    }
  },
  mounted() {
    let self = this
    this.commentListener = this.firestore
      .collection('video_on_demand')
      .doc(this.vodLibraryId)
      .collection('comments')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const newData = { id: change.doc.id, ...change.doc.data() }
          if (change.type === 'added') {
            self.comments.push(newData)
          }
          if (change.type === 'modified') {
            const index = self.comments.findIndex((item) => item.id == change.doc.id)
            self.comments.splice(index, 1, newData)
          }
          if (change.type === 'removed') {
            const index = self.comments.findIndex((item) => item.id == change.doc.id)
            self.comments.splice(index, 1)
          }
        })
      })
  },
  destroyed() {
    this.commentListener.off()
  },
  methods: {
    async onCommentSubmit(data) {
      const commentData = {
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
        attendeeId: this.userData.attendeeId,
        text: data.text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        libraryId: this.vodLibraryId,
      }
      const newComment = new Comment(commentData)
      const validatedData = newComment.getData()
    },
  },
}
</script>

<style  scoped>

</style>