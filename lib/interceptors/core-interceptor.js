'use strict'

const getDefaultAdapter = require('../core/default-adapter')
const mockAdapter = require('../adapters/mock')

module.exports = function coreInterceptor(config) {
  /**
   * 处理 `mock` 参数，优先级高于 `adapter` 参数
   *
   * 说明：
   * 1. 只要存在有效的 `mock` 参数，则挂载 `mockAdapter` 适配器
   */
  if (typeof config.mock === 'object' && Object.keys(config.mock).length > 0) {
    config.adapter = mockAdapter
  }

  /**
   * `adapter` 参数为空，则挂载对应的请求适配器
   */
  if (!config.adapter) {
    config.adapter = getDefaultAdapter()
  }

  return config
}
