/**
 * @description api调用集合
 * @author cuiyang18756
 */

'use strict'
// import http from '@/assets/js/http'
import mock from '@/assets/js/mock.js'

/**
 * @description 获取菜单
 */
const getMenus = function() {
  return Promise.resolve(mock.menus)
}

export { getMenus }
