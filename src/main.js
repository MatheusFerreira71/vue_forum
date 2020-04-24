import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import router from './router'
import AppDate from '@/components/AppDate'
import store from '@/store'

Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

Vue.component('AppDate', AppDate)

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate () {
    store.dispatch('fetchUser', { id: store.state.authId })
  }
}).$mount('#app')
