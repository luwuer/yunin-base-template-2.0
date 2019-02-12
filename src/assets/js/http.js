/**
 * @description axios方法封装
 * @author cuiyang18756
 */

'use strict'
import axios from 'axios'
import qs from 'qs' // eslint-disable-line no-unused-vars
import selfMsgBox from '@/components/SelfMsgBox'
import store from '@/store/index.js'
import router from '@/router/main.js'
import { toLogin } from '@/assets/js/common.js'

function checkStatus(response) {
  if (!response || response.status !== 200) {
    selfMsgBox.error({
      message: '提示',
      messageExtra: '请求错误',
      btns: ['确 认']
    })
    // -1 请求错误
    // -2 需要登录
    // -3 其他业务错误
    return Promise.reject(new Error(-1))
  } else if (response.data.code !== '0') {
    if (/00000009|00000005/.test(response.data.code)) { // 用户被踢出|会话已失效
      if (router.history.current.name !== 'login') {
        const login = ()=>{
          if (store.getters.accountType && store.getters.accountType === '0') {
            toLogin('admin')
          } else {
            toLogin()
          }
        }
        if (document.referrer !== '') {
          selfMsgBox.error({
            message: '提示',
            messageExtra: response.data.msg,
            btns: ['返回登录'],
            onConfirm: function() {
              login()
            }
          })
        } else {
          login()
        }
        return Promise.reject(new Error(-2))
      }
      return Promise.reject(new Error(-2))
    } else if (/00040001/.test(response.data.code)) { // 登录异常，用户信息没有获取到
      console.log('00040001:登录异常，用户信息没有获取到, toLogin...')
      if (store.getters.accountType && store.getters.accountType === '0') {
        toLogin('admin')
      } else {
        toLogin()
      }
      return Promise.reject(new Error(-2))
    }

    selfMsgBox.error({
      message: '提示',
      messageExtra: response.data.msg,
      btns: ['确 认']
    })

    return Promise.reject(new Error(-3))
  } else {
    // 如果data.data中没有数据 提示msg
    if (response.data.msg) {
      console.log(response.data.msg)
    }

    return response.data.data
  }
}

axios.defaults.withCredentials = true
// http request 拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// http response 拦截器
axios.interceptors.response.use(response => {
  // axios处理ie返回时为String类型
  if (response.data && typeof response.data === 'string') {
    try {
      response.data = JSON.parse(response.data)
    } catch (e) {
      console.error('json解析错误:', e)
      selfMsgBox.error({
        message: '提示',
        messageExtra: '请求错误',
        btns: ['确 认']
      })
      return Promise.reject(e)
    }
  }

  return checkStatus(response)
}, error => {
  // 取消请求不报错
  if (error.message === 'cancel') {
    return
  }

  selfMsgBox.error({
    message: '提示',
    messageExtra: '请求错误，请联系管理员',
    btns: ['确 认']
  })
  return Promise.reject(error)
})

let CancelToken = axios.CancelToken
let source = CancelToken.source()
export default {
  get(url, params = {}) {
    return axios({
      method: 'get',
      baseURL: config.baseUrl,  // eslint-disable-line
      url,
      params,
      timeout: 1000 * 60 * 30,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      cancelToken: source.token
    })
  },
  post(url, data = {}, onUploadProgress = null) { // eslint-disable-line no-unused-vars
    return axios({
      method: 'post',
      baseURL: config.baseUrl, // eslint-disable-line
      url,
      // data: qs.stringify(data),
      data,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      timeout: 1000 * 60 * 30,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      cancelToken: source.token
    })
  },
  all(iterable) {
    return axios.all(iterable).then(response => {
      return response
    })
  },
  cancel() {
    source.cancel('cancel')
    // 赋值新source，否则之后的请求会全部被取消
    source = CancelToken.source()
  }
}
