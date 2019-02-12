
import 'babel-polyfill' // Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API ，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）
import Vue from 'vue'
import hui from 'h_ui'
import App from './App'
import router from '@/router/main.js'
import store from '@/store'
import selfMsgBox from '@/components/SelfMsgBox'

import 'h_ui/dist/h_ui.min.css'

Vue.config.productionTip = false

Vue.use(hui)
Vue.prototype.$selfMsgBox = selfMsgBox

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
