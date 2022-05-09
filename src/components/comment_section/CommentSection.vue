<template>
  <div id="comment-section">
    <CommentForm ref="form" :saving-comment="savingComment" @submit="onCommentSubmit"></CommentForm>
    <CommentList
      ref="list"
      :comments="comments"
      :current-user-comment-likes="currentUserCommentLikes"
      @like="commentLikeButtonClicked"
    ></CommentList>
  </div>
</template>

<script>
import CommentForm from '@/components/comment_section/CommentForm'
import Comment from '@/classes/Comment'
import CommentList from '@/components/comment_section/CommentList'
export default {
  components: {
    CommentForm,
    CommentList,
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
    currentUserCommentLikes: {
      type: Object,
      default: () => {},
    },
    likedCommentsRef: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      commentListener: null,
      comments: [],
      commentsRef: null,
      savingComment: false,
    }
  },
  mounted() {
    let self = this
    this.commentsRef = this.firestore
      .collection('video_on_demand')
      .doc(this.vodLibraryId)
      .collection('comments')

    this.commentListener = this.commentsRef
      .where('videoId', '==', this.videoId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const newData = {
            id: change.doc.id,
            ...change.doc.data({ serverTimestamps: 'estimate' }),
          }
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
    this.commentListener()
  },
  methods: {
    async onCommentSubmit(data) {
      this.savingComment = true
      const commentData = {
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
        attendeeId: this.userData.attendeeId,
        text: data.text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        libraryId: this.vodLibraryId,
        videoId: this.videoId,
      }
      const newComment = new Comment(commentData)
      const validatedData = newComment.getData()
      await this.commentsRef.add(validatedData)
      this.savingComment = false
      this.$refs.form.saved()
    },
    async commentLikeButtonClicked({ id, state }) {
      let newVal = state || null
      let newCountIncrement = state ? 1 : -1
      await this.likedCommentsRef.child(id).set(newVal)
      await this.commentsRef.doc(id).update({
        likes: firebase.firestore.FieldValue.increment(newCountIncrement),
      })
    },
  },
}
</script>

<style  scoped>

</style>