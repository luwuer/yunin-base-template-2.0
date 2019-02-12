/**
 * @description cookie操作封装
 * @author cuiyang18756
 */

'use strict'
/**
 * @description 设
 * @param {String} key
 * @param {String} value
 * @param {Number} time 过期时间，毫秒
 * @param {String} path cookie保持位置
 */
function setItem(key, value, time = 1000 * 60 * 60 * 1, path) {
  let exp = new Date()
  exp.setTime(exp.getTime() + time)
  document.cookie = key + '=' + encodeURIComponent(value) + '; expires=' + exp.toUTCString() + '; path=' + (path || '/')
}

/**
 * @description 取
 * @param {String} key
 */
function getItem(key) {
  let reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
  let tmparr = document.cookie.match(reg)
  if (tmparr) {
    return decodeURIComponent(tmparr[2])
  } else {
    return null
  }
}

/**
 * @description 删
 * @param {String} key
 */
function removeItem(key, path) {
  let flag = getItem(key)
  if (flag) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    document.cookie = key + '=; expires=' + exp.toUTCString() + '; path=' + (path || '/')
    return {
      code: 1,
      info: 'success'
    }
  } else {
    return {
      code: 0,
      info: 'cookie not found'
    }
  }
}

/**
 * @description 取所有cookie的key值
 */
function keys() {
  let str = document.cookie
  let arr = str.replace(/=.+?(;? |$)/g, ',').split(',')
  arr.pop()
  return arr
}

export {
  setItem,
  getItem,
  removeItem,
  keys
}
