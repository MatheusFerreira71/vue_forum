import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/PageHome.vue'
import ThreadShow from '@/views/PageThreadShow'
import PageNotFound from '@/views/PageNotFound'
import ThreadCreate from '@/views/PageThreadCreate'
import Forum from '@/views/PageForum'
import Category from '@/views/PageCategory'
import Profile from '@/views/PageProfile'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
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
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    props: true
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
