/**
 * @description 公共函数集合 / 若项目规模扩大可再细分
 * @author cuiyang18756
 */

'use strict'

import JSEncrypt from 'jsencrypt'
import AsyncValidator from 'async-validator'
import store from '@/store'
import router from '@/router/main.js'

/**
 * @description 原型链添加格式化函数
 * @param {String} fmt
 */
Date.prototype.Format = function (fmt) { // eslint-disable-line
  let o = {
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { // 括号是必要的，否则RegExp.$1无法取得匹配值
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt
}

/**
 * @description 生成随机数
 * @param {Number} len 随机字符串长度
 */
function randStr(len) {
  let resLists = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    '.', '@', '_', '-',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let tarStr = ''
  for (let i = 0; i < len; i++) {
    let ran = Math.floor(Math.random() * 66)
    tarStr += resLists[ran]
  }
  return tarStr
}

/**
 * @description RSA加密
 * @param {String} data
 * @param {String} key
 */
function getRsaString(data, key) {
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(key)
  return encrypt.encrypt(data + randStr(32))
}

/**
 * @description RSA解密
 */
function parseRsaString(data, key) { // eslint-disable-line
  let encrypt = new JSEncrypt()
  encrypt.setPrivateKey(key)
  return encrypt.decrypt(data).replace(/.{32}$/, '')
}

/**
 * @description 判断是否为VNode
 * @param {Object} node 被判断对象
 */
function selfIsVNode(node) {
  return node !== null && typeof node === 'object' && node.hasOwnProperty('componentOptions')
}

/**
 * @description 激活tab、路由
 * @param {String} path
 * @param {Object} query URL查询参数
 * @param {String} des tab显示的描述
 */
function activeTabByPath(path, query = {}, des = '') {
  let queryStr = ''
  let index = 0
  for (let key in query) {
    if (key !== 'update') {
      if (index === 0) {
        queryStr += `?${key}=${query[key]}`
      } else {
        queryStr += `&${key}=${query[key]}`
      }
    }
    index++
  }

  // tab
  store.dispatch('activeMenu', {
    routePath: path + queryStr,
    des: des || store.getters.routesMap[path].des
  })

  // 路由
  router.push({
    path,
    query
  })
}

/**
 * @description 激活tab、路由
 * @param {String} name
 * @param {Object} params
 */
function activeTabByName(path, params = {}) {
  const route = store.getters.routesMap[path]
  // tab
  store.dispatch('activeMenu', {
    routePath: path,
    des: route.des
  })

  // 路由
  router.push({
    name: route.name,
    params: params
  })
}

function getDesKeyAndIv() {
  const key = randStr(16)
  const iv = randStr(16)
  return { key: key, iv: iv }
}

/**
 * 获取当前浏览器类型
 * @returns {string}
 */
function getUserAgentType() {
  const userAgent = navigator.userAgent
  let type = 'unknown'
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isEdge) {
    type = 'edge'
  } else if (isIE11) {
    type = 'IE11'
  } else if (isIE) {
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE 10.0') > -1) {
      type = 'IE10'
    } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE 9.0') > -1) {
      type = 'IE9'
    } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE 8.0') > -1) {
      type = 'IE8'
    } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE 7.0') > -1) {
      type = 'IE7'
    }
  } else if (userAgent.indexOf('OPR') > -1) {
    type = 'Opera'
  } else if (userAgent.indexOf('Version') > -1 && userAgent.indexOf('Safari') > -1) {
    type = 'Safari'
  } else if (userAgent.indexOf('Chrome') > -1) {
    type = 'Chrome'
  } else if (userAgent.indexOf('Firefox') > -1) {
    type = 'Firefox'
  }
  return type
}

/**
 * 获取当前浏览器类型和版本
 * @returns {browser(浏览器类型),ver(版本)}
 */
function getBrowserInfo() {
  let Sys = {}
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    Sys.browser = 'IE'
    Sys.ver = 11
  } else {
    let ua = navigator.userAgent.toLowerCase()
    let re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/
    let m = ua.match(re)
    Sys.browser = m[1].replace(/version/, 'safari')
    Sys.ver = m[2]
  }
  return Sys
}

/**
 * @description 跳转登录
 */
function toLogin() {
  let origin = location.origin
  location.href = `${origin}/login.html#/`
}

/**
 * @description 深拷贝
 */
function deepcopy(data) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * @description 触发window resize
 */
function windowResize() {
  let e = new Event('resize')
  window.dispatchEvent(e)
}

/**
 * @description 手动触发字段校验
 * @param {Object} descriptor 规则 { field: [rule1, rule2] }
 * @param {Object} model 字段值 { field: 123 }
 * @param {Function} callback 校验出错后的回调
 */
function indValidate(descriptor, model, callback = function () { }) {
  const validator = new AsyncValidator(descriptor)
  validator.validate(model, { firstFields: true }, errors => {
    callback(errors)
  })
}

/**
 * @description 使用script标签动态加载依赖
 * @param {String} 依赖路径
 * @param {Function} 加载回调
 */
function getDependencyByScript(url, callback) {
  const loaderScript = window.document.createElement('script')
  loaderScript.type = 'text/javascript'
  loaderScript.src = url
  loaderScript.addEventListener('load', callback)
  window.document.body.appendChild(loaderScript)
}

export {
  getRsaString,
  parseRsaString,
  selfIsVNode,
  activeTabByPath,
  activeTabByName,
  getUserAgentType,
  getBrowserInfo,
  getDesKeyAndIv,
  deepcopy,
  windowResize,
  toLogin,
  indValidate,
  getDependencyByScript
}
