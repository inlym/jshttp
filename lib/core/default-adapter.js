'use strict'

function isWxMiniprogram() {
  return typeof wx === 'object' && typeof wx.request === 'function'
}

/**
 * 获取默认请求适配器
 *
 * 说明：
 * 1. 仅处理附加的适配器
 * 2. `xhr` 和 `nodejs` 的适配器不处理，由 `axios` 接管
 */
module.exports = function getDefaultAdapter() {
  let adapter

  if (isWxMiniprogram()) {
    adapter = require('../adapters/wx-miniprogram')
  }

  return adapter
}
