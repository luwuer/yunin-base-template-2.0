import Vue from 'vue'
import Vuex from 'vuex'
import main from './modules/main.js'
import user from './modules/user.js'
import permission from './modules/permission.js'
import getters from './getters.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    user,
    permission
  },
  getters
})
