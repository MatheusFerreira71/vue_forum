import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/PageHome.vue'
import ThreadShow from '@/views/PageThreadShow'
import PageNotFound from '@/views/PageNotFound'
import ThreadCreate from '@/views/PageThreadCreate'
import ThreadEdit from '@/views/PageThreadEdit'
import Forum from '@/views/PageForum'
import Category from '@/views/PageCategory'
import Profile from '@/views/PageProfile'
import Register from '@/views/PageRegistration'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/thread/create/:forumId',
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
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
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
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
