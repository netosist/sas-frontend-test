// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase'
import App from './App'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowRight,faCheckCircle,faTimesCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyC1CN59AH3Re-GeHqR5-kMKeUJRQ_EFUAo",
  authDomain: "sas-frontend-test.firebaseapp.com",
  databaseURL: "https://sas-frontend-test.firebaseio.com",
  projectId: "sas-frontend-test",
  storageBucket: "sas-frontend-test.appspot.com",
  messagingSenderId: "565188695537",
  appId: "1:565188695537:web:b5c832311384a11596e050"
};

firebase.initializeApp(firebaseConfig);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
