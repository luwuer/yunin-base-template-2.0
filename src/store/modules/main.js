import * as ck from '@/assets/js/cookie.js'
import ss from '@/assets/js/ss'

const STATICTABS = [
  {
    routePath: '/',
    des: '首页'
  }
]

const main = {
  state: {
    langType: ck.getItem('lang') || 'zh-CN', // 语言类型
    lang: {},
    currentTab: ss.getItem('currentTab') || 0, // 当前显示tab的索引
    tabs: ss.getItem('tabs') || STATICTABS, // tab容器内显示的tabs
    closedTabs: [], // 关闭过的tab标签
    busDatas: { // 全局业务相关变量
    },
    cssDatas: { // 全局样式相关变量
      pageContainerHeight: 0,
      menuShrink: false // 菜单收缩
    }
  },

  mutations: {
    /**
     * @description 添加单个tab
     * @param {*} state
     * @param {Object} tab
     */
    addTab(state, tab) {
      state.tabs.push(tab)
      ss.setItem('tabs', state.tabs)
    },

    /**
     * @description 修改单个tab
     * @param {*} state
     * @param {Object} obj index / tab
     */
    modifyTab(state, obj) {
      state.tabs.splice(obj.index, 1, obj.tab)
      ss.setItem('tabs', state.tabs)
    },

    /**
     * @description 移除指定位置的tab
     * @param {*} state
     * @param {Number} tabIndex
     */
    removeTab(state, tabIndex) {
      state.tabs.splice(tabIndex, 1)
      ss.setItem('tabs', state.tabs)
    },

    /**
     * @description 移除全部tab
     */
    removeTabs(state) {
      state.tabs = STATICTABS.slice(0, 1)
      ss.removeItem('tabs')
    },

    /**
     * @description 设置当前tab
     * @param {*} state
     * @param {Number} tabIndex 当前显示tab的索引
     */
    setCurrentTab(state, tabIndex) {
      state.currentTab = tabIndex
      ss.setItem('currentTab', tabIndex)
    },

    /**
     * @description 添加已经关闭tab的path
     * @param {*} state
     * @param {*} path
     */
    addClosedTab(state, path) {
      state.closedTabs.push(path)
    },

    /**
     * 移除已经关闭tab的path
     * @param state
     * @param path
     */
    delClosedTab(state, path) {
      state.closedTabs.splice(state.closedTabs.findIndex(r => r === path), 1)
    },

    /**
     * @description 设置detailDatas
     * @param {*} obj 载荷，obj.target为detailDatas的某一个属性，obj.val为值
     */
    setBusDatas(state, obj) {
      window.sessionStorage.setItem(`bus.${obj.target}`, JSON.stringify(obj.val))
      state.busDatas[obj.target] = obj.val
    },

    /**
     * @description 设置cssDatas
     * @param {*} obj 载荷，obj.target为cssDatas的某一个属性，obj.val为值
     */
    setCssDatas(state, obj) {
      state.cssDatas[obj.target] = obj.val
    },

    /**
     * @description 设置语言类型
     */
    setLangType(state, langType) {
      state.langType = langType
    },

    /**
     * @description 设置语言类型对应的数据
     */
    setLang(state, lang) {
      state.lang = lang
    }
  },
  actions: {
    /**
     * @description 从文件中获取字体数据
     * @param {*} param0
     * @param {*} type
     */
    fetchLang({ commit }, type = 'zh-CN') {
      const data = require(`@/assets/lang/${type}/index`)
      commit('setLang', data)
      // import(`@/assets/lang/${type}/index`).then(data => {
      //   console.log(data)
      //   commit('setLang', data)
      // })
    },
    activeMenu({ state, commit }, tab) {
      state.newTabFlag = !state.tabs.some((item, index) => {
        if (item.routePath.replace(/\?.*$/, '') === decodeURIComponent(tab.routePath).replace(/\?.*$/, '')) {
          item.routePath = decodeURIComponent(tab.routePath)
          item.des = tab.des
          commit('setCurrentTab', index)
          return true
        }
        return false
      })

      if (state.newTabFlag) {
        commit('addTab', tab)
        commit('setCurrentTab', state.tabs.length - 1)
      }
    },
    removeTabByPath({ state, commit }, path) {
      let reIndex = -1
      state.tabs.forEach((item, index) => {
        if (item.routePath === path) {
          reIndex = index
        }
      })
      commit('removeTab', reIndex)
    }
  },

  /**
   * @description 重置tab
   */
  tabReset() {
    this.mutations.removeTabs(this.state)
    this.mutations.setCurrentTab(this.state, 0)
  }
}

export default main
