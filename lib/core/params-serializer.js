'use strict'

function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}
/**
 * 重写 `axios` 默认的 `paramsSerializer` 方法，增加以下逻辑：
 *
 * 1. 按键名字典排序
 */
module.exports = function paramsSerializer(params) {
  const parts = []
  const basicType = ['number', 'string', 'boolean']

  const keys = Object.keys(params)
  keys.forEach((key) => {
    const val = params[key]
    const type = getType(val)
    if (basicType.includes(type)) {
      parts.push(`${key}=${String(val)}`)
    } else if (type === 'array') {
      val.forEach((item) => {
        if (basicType.includes(getType(item))) {
          parts.push(`${key + '[]'}=${String(item)}`)
        }
      })
    } else if (type === 'date') {
      parts.push(`${key}=${val.toISOString()}`)
    } else if (type === 'object') {
      parts.push(`${key}=${JSON.stringify(val)}`)
    } else {
      // 其余均不处理
    }
  })

  parts.sort()

  return parts.join('&')
}
