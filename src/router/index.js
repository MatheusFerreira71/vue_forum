import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/PageHome.vue'
import ThreadShow from '@/views/PageThreadShow'
import PageNotFound from '@/views/PageNotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true
  },
  {
    path: '*',
    name: 'NotFound',
    component: PageNotFound
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
