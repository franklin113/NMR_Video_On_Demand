import Vue from 'vue'
import VueRouter from 'vue-router'
import VideoOnDemand from '@/components/VideoOnDemand'
import { LIST_VIEW_ROUTE_NAME, VIDEO_PLAYER_ROUTE_NAME } from './constants'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: LIST_VIEW_ROUTE_NAME,
    component: VideoOnDemand,
  },
  {
    path: '/player',
    name: VIDEO_PLAYER_ROUTE_NAME,
    component: VideoOnDemand,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
