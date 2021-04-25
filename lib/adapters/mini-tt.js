'use strict'

/**
 * 字节跳动小程序
 * @see https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/network/http/tt-request
 */

const createMiniAdapter = require('./mini-base.js')

const options = {
  /** 所在平台简称 */
  name: 'tt',

  /** 对应的全局变量 */
  platform: tt,

  /** 支持的请求方法
   *
   *
   * GET/POST/OPTIONS/PUT/HEAD/DELETE
   */
  methods: ['GET', 'HEAD', 'POST', 'OPTIONS', 'PUT', 'DELETE'],

  /** 参数别名 */
  alias: {
    requestHeaders: 'header',
    responseHeaders: 'header',
    statusCode: 'statusCode',
  },
}

module.exports = createMiniAdapter(options)
