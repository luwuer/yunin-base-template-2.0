import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import selfMsgBox from '@/components/SelfMsgBox'
import { toLogin } from '@/assets/js/common.js'
import { hLoadingBar } from 'h_ui'

Vue.use(Router)

let routes = []

let router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  hLoadingBar.start()
  // 404不检查菜单权限
  if (to.name === '404') {
    next()
  } else {
    // 没有菜单
    if (!store.getters.containerRoutes.length) {
      // 取菜单
      store.dispatch('getMenusAndRoutes').then(() => {
        router.addRoutes(store.getters.containerRoutes)

        if (to.fullPath !== '/') {
          // 生成tab时需要去除参数
          let path = to.fullPath.split('?')[0]
          store.dispatch('activeMenu', {
            routePath: to.fullPath,
            des: store.getters.routesMap[path].des
          })
        }

        // 需指明路径，否则会因为异步执行next导致一些问题
        next(to.fullPath)
      }).catch((err) => {
        if (err.message !== '-2') {
          selfMsgBox.error({
            message: '提示',
            messageExtra: '生成菜单失败',
            btns: ['返回登录'],
            onConfirm: function () {
              if (store.getters.accountType && store.getters.accountType === '0') {
                toLogin('admin')
              } else {
                toLogin()
              }
            }
          })
        }
      })
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  hLoadingBar.finish()
})

export default router
