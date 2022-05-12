<template>
  <div class="truncate-text-component">
    <div v-if="!show && !isHTML" class="truncate-text-inner">
      <span class="truncate-text" :class="textClass">
        {{ truncate(text) }}
      </span>
      <button
        v-if="showToggle && text.length >= length"
        class="truncate-btn"
        :class="actionClass"
        @click="toggle"
      >
        {{ clamp }}
      </button>
    </div>

    <div v-else-if="!show && isHTML">
      <span :class="textClass" v-html="truncate(text)" />
      <button v-if="showToggle && text.length >= length" :class="actionClass" @click="toggle">
        {{ clamp }}
      </button>
    </div>
    <div v-if="show && !isHTML">
      <span>{{ text }}</span>
      <button v-if="showToggle && text.length >= length" :class="actionClass" @click="toggle">
        {{ less }}
      </button>
    </div>
    <div v-else-if="show && isHTML">
      <div v-if="text.length >= length" v-html="text" />
      <button v-if="showToggle && text.length >= length" :class="actionClass" @click="toggle">
        {{ less }}
      </button>
      <p v-else>
        {{ h2p(text) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TruncateText',
  props: {
    truncated: {
      type: Boolean,
      default: true,
    },
    collapsedTextClass: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: true,
    },
    clamp: {
      type: String,
      default: 'Read More',
    },
    length: {
      type: Number,
      default: 100,
    },
    less: {
      type: String,
      default: 'Show Less',
    },
    type: {
      type: String,
      default: 'text',
    },
    actionClass: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    isHTML() {
      return this.type === 'html'
    },
    textClass() {
      return this.textLength > this.length && this.collapsedTextClass ? this.collapsedTextClass : ''
    },
    textLength() {
      if (this.isHTML) {
        // We need the length of the text without the html being considered
        // This ensures we provide the right calculation for when to show/hide the more link
        const text = this.text.replace(/<[^>]*>/g, '')
        return text.length
      }

      return this.text.length
    },
    showToggle() {
      return this.show_truncate_toggle && this.textLength > this.length
    },
  },
  watch: {
    truncated(value) {
      this.toggle(value)
    },
  },
  created() {
    // this.show = this.truncated
    // this.toggle(this.truncated)
  },
  methods: {
    truncate(string) {
      if (string) {
        if (this.type === 'html') return h2p(string, this.length)
        let tempStr = string.toString().substring(0, this.length)
        if (tempStr.length > this.length - 3) {
          tempStr += '...'
        }
        return tempStr
      }

      return ''
    },
    toggle(override) {
      // use the override value if it is set as a boolean
      // const toggled = typeof override === 'boolean' ? override : !this.show;

      // this.show = toggled;
      this.$emit('toggle', this.show)
    },
  },
}
</script>












<style lang="scss" scoped>

</style>