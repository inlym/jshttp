'use strict'

/**
 * QQ 小程序
 * @see https://q.qq.com/wiki/develop/miniprogram/API/network/network_request.html
 */

const createMiniAdapter = require('./mini-base.js')

const options = {
  /** 所在平台简称 */
  name: 'qq',

  /** 对应的全局变量 */
  platform: qq,

  /** 支持的请求方法 */
  methods: ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'],

  /** 参数别名 */
  alias: {
    requestHeaders: 'header',
    responseHeaders: 'header',
    statusCode: 'statusCode',
  },
}

module.exports = createMiniAdapter(options)
