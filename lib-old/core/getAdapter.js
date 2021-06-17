'use strict'

/**
 * 根据环境变量，判断所处的环境类型，选择适配器
 *
 * 备注：
 * 1. `require` 语句不能在顶上提前使用，非特定环境引入模块将会无法运行而报错，只能在确定所处环境后引入
 */
module.exports = function getAdapter() {
  // 浏览器环境（各小程序环境把）
  /**
   * 普通浏览器环境、React Native 环境
   *
   * 说明：
   * 1. 各 `小程序` 环境把 `XMLHttpRequest` 直接禁用了，即
   * ```js
   * typeof XMLHttpRequest === 'undefined' // true
   * ```
   */
  if (typeof XMLHttpRequest === 'function') {
    return require('../adapters/xhr.js')
  }

  /**
   * Node.js 环境
   */
  if (typeof process === 'object' && typeof Buffer === 'function') {
    return require('../adapters/node.js')
  }

  /**
   * 微信小程序
   */
  if (typeof wx === 'object' && typeof wx.request === 'function') {
    return require('../adapters/mini-wx.js')
  }

  /**
   * 支付宝小程序
   */
  if (typeof my === 'object' && typeof my.request === 'function') {
    return require('../adapters/mini-my.js')
  }

  /**
   * QQ 小程序
   */
  if (typeof qq === 'object' && typeof qq.request === 'function') {
    return require('../adapters/mini-qq.js')
  }

  /**
   * 字节跳动小程序
   */
  if (typeof tt === 'object' && typeof tt.request === 'function') {
    return require('../adapters/mini-tt.js')
  }

  throw new Error('暂时无法识别当前的 Javascript 环境，请使用自定义适配器 `config.adapter` 或联系作者添加当前环境适配器！')
}
