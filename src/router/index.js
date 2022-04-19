import Vue from 'vue'
import VueRouter from 'vue-router'
import VideoOnDemand from '@/components/VideoOnDemand'

Vue.use(VueRouter)
const listViewRouteName = 'list'
const videoPlayerRouteName = 'videoplayer'
const routes = [
  {
    path: '/',
    name: listViewRouteName,
    component: VideoOnDemand,
  },
  {
    path: '/',
    name: videoPlayerRouteName,
    component: VideoOnDemand,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
