import ss from '@/assets/js/ss'

const user = {
  state: {
    user: ss.getItem('user') || {
      operatorNam: 'test'
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      ss.setItem('user', user)
    }
  },
  actions: {
    login({ commit }, userInfo) {
      // call login api add modify user data
      commit('setUser', userInfo)
    },
    logout({ commit }) {
      // call logout api add reset user data
      commit('setUser', {})
    }
  }
}

export default user
