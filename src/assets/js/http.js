/**
 * @description axios方法封装
 * @author cuiyang18756
 */

'use strict'
import axios from 'axios'

function checkStatus(response) {
  // TODO 校验状态
  return response
}

// 跨域携带cookies
axios.defaults.withCredentials = true

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // TODO 错误提示
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // ie
    if (response.data && typeof response.data === 'string') {
      response.data = JSON.parse(response.data)
    }

    return checkStatus(response)
  },
  error => {
    // 取消请求不报错
    if (error.message === 'cancel') {
      return
    }

    // TODO 错误提示
    return Promise.reject(error)
  }
)

let CancelToken = axios.CancelToken
let source = CancelToken.source()
export default {
  get(url, params = {}) {
    return axios({
      method: 'get',
      baseURL: config.baseUrl,
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
  post(url, data = {}, onUploadProgress = null) {
    return axios({
      method: 'post',
      baseURL: config.baseUrl,
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
