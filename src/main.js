import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
// import * as firebase from 'firebase'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: "AIzaSyA_m-Cntfs1VUOFzCg_scngg2eelbcPGPY",
      authDomain: "fareandbalanced-alpha.firebaseapp.com",
      databaseURL: "https://fareandbalanced-alpha-default-rtdb.firebaseio.com",
      projectId: "fareandbalanced-alpha",
      storageBucket: "fareandbalanced-alpha.appspot.com",
      messagingSenderId: "870391492699",
      appId: "1:870391492699:web:70a2494ccaba71d007cf7e",
      measurementId: "G-9RN5GKJDRR"
    })
  }
  // firebase.initializeApp(firebaseConfig);
}).$mount('#app')
