<template>
  <div id="app">
    <VideoOnDemand />
  </div>
</template>

<script>
import VideoOnDemand from './components/VideoOnDemand.vue'

export default {
  name: 'App',
  components: {
    VideoOnDemand,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
