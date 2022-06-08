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
  scrollBehavior(to, from, savedPosition) {
    if (to.name === VIDEO_PLAYER_ROUTE_NAME) {
      return { x: 0, y: 0 }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

export default router
