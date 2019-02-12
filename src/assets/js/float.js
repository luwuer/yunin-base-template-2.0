/**
 * @description 浮点数运算类（加减乘除）
 * <例子> 0.2 + 0.4 = 0.6000000000000001 | 19.9 * 100 = 1989.9999999999998
 * <原理> 转化为整数之后再运算，避免浮点计算误差
 * @author cuiyang18756
 */

const float = (function () {
  /**
   * @param {Number} f 浮点数
   * @return {Object}
   * ** { int: 整数, multiple: 浮点数变整数的倍数 }
   */
  function floatToObj(f) {
    let tmp = f.toString().split('.')
    let int = parseInt(tmp.join(''))
    let multiple = tmp[1] ? tmp[1].length : 0

    return {
      int,
      multiple: Math.pow(10, multiple)
    }
  }

  /**
   * @description 获取入参浮点数全部转化为整数需要的最小倍数 / 小数点右移位数
   */
  function toIntMinMultiple() {
    let args = Array.from(arguments)
    let tmp = []
    let multiple = 0
    args.forEach(num => {
      tmp = num.toString().split('.')
      let m = tmp[1] ? tmp[1].length : 1
      m > multiple && (multiple = m)
    })

    // return Math.pow(10, multiple)
    return multiple
  }

  function add() {
    let args = Array.from(arguments)
    let count = toIntMinMultiple(...args)
    let mul = Math.pow(10, count)
    let argsInObj = args.map(num => floatToObj(num))

    let result = 0
    argsInObj.forEach(item => {
      result += item.int * (mul / item.multiple)
    })
    return result / mul
  }

  return { add }
})()

const add = float.add

export {
  add
}
