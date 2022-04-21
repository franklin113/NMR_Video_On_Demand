<template>
  <b-form v-if="show" @submit.prevent="onSubmit" @reset="onReset">
    <b-form-input
      id="inline-form-input-name"
      v-model="form.text"
      class="mb-2 mr-sm-2 mb-sm-0"
      placeholder="Add a comment..."
      @click="dirty = true"
    ></b-form-input>
    <div id="comment-form-btns">
      <b-button v-if="dirty" id="comm-form-cancel" type="reset" variant="light">Cancel</b-button>
      <b-button
        id="comm-form-submit"
        type="submit"
        :disabled="form.text.length == 0 || savingComment"
        variant="primary"
        >Comment</b-button
      >
    </div>
  </b-form>
</template>

<script>
import debounce from '@/utils/debounce'

export default {
  props: {
    savingComment: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: true,
      dirty: false,
      form: {
        text: '',
      },
    }
  },
  methods: {
    onSubmit: debounce(function () {
      this.$emit('submit', this.form)
      this.dirty = false
    }, 250),
    onReset() {
      this.dirty = false
    },
    saved() {
      this.dirty = false
      this.form.text = ''
    },
  },
}
</script>

<style scoped>
#comment-form-btns {
  text-align: right;
}
/* #comm-form-cancel {
  background-color: transparent;
  color: #000;
  border: none;
} */
</style>