/**
 * @description sessionStorage函数封装
 * @author cuiyang18756
 */

const TMP = '[?=pa]'

export default {
  /**
   * @description 存储数据
   * @param {String} name 保存在ss中的字段名
   * @param {String} value 保存在ss中的字段值
   */
  setItem: function (name, value) {
    if (value === undefined || value === null) {
      return
    }

    value = JSON.stringify(value) + TMP
    let enValue = encodeURIComponent(value)
    sessionStorage.setItem(name, enValue)
  },

  /**
   * @description 获取数据
   * @param {String} name 保存在ss中的字段名
   * @param {String} value 保存在ss中的字段值
   */
  getItem: function (name) {
    let enValue = sessionStorage.getItem(name)
    if (enValue) {
      let value = decodeURIComponent(enValue).split(TMP).join('')
      return JSON.parse(value)
    } else {
      return false
    }
  },

  /**
   * @description 删除变量
   * @param {String} name 保存在ss中的字段名
   */
  removeItem: function(name) {
    sessionStorage.removeItem(name)
  }
}
