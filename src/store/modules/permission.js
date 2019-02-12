import { getMenus } from '@main/assets/js/api.js'

/**
 * @description 递归分离出菜单中的路由信息
 * @param {String} routes
 * @param {String} menus
 */
function splitRoutesFromMenus(routes, menus) {
  menus.forEach(item => {
    if (item.children && item.children.length) {
      splitRoutesFromMenus(routes, item.children)
    }

    if (item.url) {
      let temp = item.url.trim()
      temp === '/' && (temp = '/index')

      routes.push({
        path: item.url,
        name: item.code,
        des: item.title,
        meta: {
          keepAlive: true
        },
        component: resolve => require([`@main/views${temp}/index.vue`], resolve)
      })
    }
  })
}

/**
 * @description 生成首页菜单
 */
function generateIndexMenu() {
  return [{
    level: 1,
    type: 1,
    id: 1,
    title: '首页',
    url: '/',
    code: 'index',
    icon: 'icon-caidan-',
    expand: false
  }]
}

/**
 * @description 不需要再菜单中显示的路由
 */
const STATICROUTES = [
  {
    path: '/common/user/info',
    name: 'userInfo',
    des: '个人中心',
    meta: {
      keepAlive: true
    },
    component: resolve => require(['@main/views/common/user-info/index.vue'], resolve)
  }
]

const permission = {
  state: {
    menus: [], // 菜单
    routesInfo: [], // container的所有子路由数组
    routesMap: {}, // 路由map，key值为path
    containerRoutes: [] // 包含container路由对象的routes数组
  },

  mutations: {
    setMenus(state, menus) {
      state.menus = menus
    },
    setRoutesInfo(state, routesInfo) {
      state.routesInfo = routesInfo
    },
    setRoutesMap(state, routesMap) {
      state.routesMap = routesMap
    },
    setContainerRoutes(state, routes) {
      state.containerRoutes = routes
    }
  },

  actions: {
    generateRoutesByMenus({ commit }, menus) {
      let menuRoutes = []
      let routesMap = {}
      splitRoutesFromMenus(menuRoutes, menus)
      menuRoutes = menuRoutes.concat(STATICROUTES)
      commit('setRoutesInfo', menuRoutes)

      menuRoutes.forEach(item => {
        routesMap[item.path] = item
      })
      commit('setRoutesMap', routesMap)

      // console.log(menuRoutes.map(item => item.name))
      // console.log(menuRoutes)
      console.log(menuRoutes.map(item => item.path))
      let tmpRoutes = [{
        path: '/',
        component: resolve => require(['@main/components/Container.vue'], resolve),
        children: menuRoutes.concat({
          path: '*',
          redirect: '/'
        })
      }]

      // console.log(tmpRoutes)
      commit('setContainerRoutes', tmpRoutes)
    },
    getMenusAndRoutes({ commit, dispatch }) {
      return getMenus().then(data => {
        let tmp = generateIndexMenu().concat(data)
        tmp.forEach(item => {
          item.expand = false
        })
        commit('setMenus', tmp)
        dispatch('generateRoutesByMenus', tmp)
      }).catch(err => {
        return Promise.reject(err) // no permission
      })
    }
  },

  /**
   * @description 重置权限数据
   */
  reset: function () {
    this.state.menus = []
    this.state.routesInfo = []
    this.state.routesMap = {}
    this.state.containerRoutes = []
  }
}

export default permission
