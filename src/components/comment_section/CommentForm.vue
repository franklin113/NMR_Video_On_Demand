<template>
  <b-form v-if="show" @submit="onSubmit" @reset="onReset">
    <b-form-input
      id="inline-form-input-name"
      class="mb-2 mr-sm-2 mb-sm-0"
      placeholder="Jane Doe"
    ></b-form-input>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    }
  },
  methods: {
    onSubmit() {},
    onReset() {},
  },
}
</script>

<style scoped>

</style>