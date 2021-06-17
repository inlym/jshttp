'use strict'

const createMiniAdapter = require('./mini-base.js')

const options = {
  /** 所在平台简称 */
  name: 'wx',

  /** 对应的全局变量 */
  platform: wx,

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
