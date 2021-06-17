'use strict'

const base = require('./defaults.js')

/**
 * 合并配置项
 * @param {object} base 基础配置项，包含所有可配置键名
 * @param {object} defaults 实例的默认配置项
 * @param {object} comtom 本次请求设置的配置项
 *
 * 说明：
 * 1. 优先级：`comtom` > `defaults` > `base`
 */
module.exports = function mergeConfig(base, defaults, custom) {
  /**
   * 第一类键名
   *
   * 说明：
   * 1. 更高优先级存在值，则直接覆盖低优先级配置
   */
  const firstTypeKeys = [
    'method',
    'baseURL',
    'url',
    'requestType',
    'responseType',
    'responseEncoding',
    'timeout',
    'retry',
    'mock',
    'adapter',
    'data',
    'middleware',
    'responseItems',
    'validateStatus',
    'sign',
    'debug',
    'logging',
  ]

  /**
   * 第二类键名
   *
   * 说明：
   * 1. 更高优先级存在对应值，不会覆盖低优先级，而是做合并处理
   * 2. 对应值类型应为 `object`
   * 3. 对象内同名键，更高优先级覆盖低优先级
   */
  const secondTypeKeys = ['headers', 'params']

  firstTypeKeys.forEach((key) => {
    custom[key] = custom[key] || defaults[key] || base[key]
  })

  secondTypeKeys.forEach((key) => {
    custom[key] = Object.assign({}, base[key], defaults[key] || {}, custom[key] || {})
  })

  return custom
}
