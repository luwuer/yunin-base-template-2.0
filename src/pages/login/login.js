import Vue from 'vue'
import App from './App'
import router from '@/router/login.js'
import store from '@/store'
import selfMsgBox from '@/components/SelfMsgBox'

Vue.config.productionTip = false

Vue.prototype.$selfMsgBox = selfMsgBox

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
