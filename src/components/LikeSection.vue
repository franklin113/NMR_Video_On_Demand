<template>
  <div>
    <i v-if="active" class="fas fa-star"></i>
    <i v-else class="far fa-star"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
    }
  },
  methods: {
    clicked(item) {
      this.$emit('click', item, $event)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>