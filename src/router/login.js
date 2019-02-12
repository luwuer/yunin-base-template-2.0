import Vue from 'vue'
import Router from 'vue-router'
import Index from '@login/views/index'
import browsersSupport from '@login/views/browsers-support'
import { getBrowserInfo } from '@/assets/js/common.js'

Vue.use(Router)

export default new Router({
  // mode: config.env === 'development' ? 'hash' : 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'index' }
    },
    {
      path: '/:type',
      name: 'index',
      component: Index,
      beforeEnter: (to, from, next) => {
        let browserInfo = getBrowserInfo()
        if (browserInfo.browser === 'chrome') {
          if (Number(browserInfo.ver.split('.')[0]) >= 51) {
            next()
          } else {
            next('/browsersSupport')
          }
        } else {
          next('/browsersSupport')
        }
      }
    },
    {
      path: '/browsersSupport',
      name: 'browsersSupport',
      component: browsersSupport
    }
  ]
})
