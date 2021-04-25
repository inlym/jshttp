'use strict'

const methods = require('../static/methods.js')

/**
 * 支持不定长度的参数形式，合成一个参数对象
 *
 * 格式演示：
 * 1. `('get', '/path.to?name=mark', { baseURL: 'https://www.jshttp.com' })`
 * 2. `('/path.to?name=mark')`
 * 3. `({ baseURL: 'https://www.jshttp.com', method: 'post'})`
 * 4. `({ baseURL: 'https://www.jshttp.com' }, 'get', '/path.to?name=mark',)`
 */
module.exports = function buildConfig(...args) {
  if (args.length === 0) {
    throw new Error('请求配置项 `config` 不能为空')
  }

  // 首先生成一个对象列表
  const configList = args.map((value) => {
    if (typeof value === 'object' && value !== null) {
      return value
    } else if (typeof value === 'string') {
      if (methods.includes(value.toUpperCase())) {
        return { method: value.toUpperCase() }
      } else {
        return { url: value }
      }
    }
  })

  const config = {}
  Object.assign(config, ...configList)

  return config
}
