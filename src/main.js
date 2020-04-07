import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import router from './router'
import AppDate from '@/components/AppDate'
import store from '@/store'

Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAUsGH829H3gG7JNGuXjr9xAD5YA5ZRp3E',
  authDomain: 'vue-school-forum-5ba79.firebaseapp.com',
  databaseURL: 'https://vue-school-forum-5ba79.firebaseio.com',
  projectId: 'vue-school-forum-5ba79',
  storageBucket: 'vue-school-forum-5ba79.appspot.com',
  messagingSenderId: '145646874594',
  appId: '1:145646874594:web:20d1c8efcff936298f13bb',
  measurementId: 'G-0WF1TW5X0P'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

Vue.component('AppDate', AppDate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
