// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase/app'
import App from './App'
import router from './router'
import store from '@/store'
import AppDate from '@/components/AppDate'

Vue.component('AppDate', AppDate)

Vue.config.productionTip = false
// Initialize Firebase 
const config = {
  apiKey: 'AIzaSyA0V_z9a9YSTi8UWYwNEZy_31QThhMAG5Q',
  authDomain: 'oz-forum.firebaseapp.com',
  databaseURL: 'https://oz-forum.firebaseio.com',
  projectId: 'oz-forum',
  storageBucket: 'oz-forum.appspot.com',
  messagingSenderId: '757170567581',
  appId: '1:757170567581:web:9ff74078a469addf3a1774',
  measurementId: 'G-1ZZK8B3G2S'
}
firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
