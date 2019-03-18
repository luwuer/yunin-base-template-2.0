import Vue from 'vue'
import App from './App.vue'
import Hui from 'h_ui'

import 'h_ui/dist/h_ui.min.css'

Vue.config.productionTip = false

Vue.use(Hui)

new Vue({
  render: h => h(App)
}).$mount('#app')
